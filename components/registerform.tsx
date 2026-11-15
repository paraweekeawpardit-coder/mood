"use client";

import axios from "axios";
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import AuthField from "../components/Authfield";
import { API_URL, getErrorMessage } from "@/lib/auth";

type Props = {
    setIslogin: Dispatch<SetStateAction<boolean>>;
    setNotice: Dispatch<SetStateAction<string>>;
};

type FieldErrors = {
    name?: string;
    contact?: string;
    password?: string;
    agreed?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidContact(value: string) {
    if (value.includes("@")) return EMAIL.test(value);
    return /^\+?\d{9,15}$/.test(value.replace(/[\s-]/g, ""));
}

export default function Registerform({ setIslogin, setNotice }: Props) {
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [registerData, setRegisterData] = useState({
        name: "",
        contact: "",
        password: "",
    });
    const dialogRef = useRef<HTMLDialogElement>(null);

    // กฎ Password Policy
    const pwdChecks = {
        length: registerData.password.length >= 8,
        upper: /[A-Z]/.test(registerData.password),
        lower: /[a-z]/.test(registerData.password),
        number: /\d/.test(registerData.password),
    };
    const isPasswordValid = Object.values(pwdChecks).every(Boolean);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (loading) return;

        const name = registerData.name.trim();
        const contact = registerData.contact.trim();
        const newErrors: FieldErrors = {};

        // ตรวจสอบรายช่อง
        if (!name) {
            newErrors.name = "Please enter a username.";
        } else if (name.length < 3) {
            newErrors.name = "Username must be at least 3 characters.";
        }

        if (!contact) {
            newErrors.contact = "Please enter your phone number or email.";
        } else if (!isValidContact(contact)) {
            newErrors.contact = "Enter a valid phone number (9-15 digits) or email address.";
        }

        if (!registerData.password) {
            newErrors.password = "Please enter a password.";
        } else if (!isPasswordValid) {
            newErrors.password = "Password does not meet all security requirements.";
        }

        if (!agreed) {
            newErrors.agreed = "You must agree to the privacy information to continue.";
        }

        setErrors(newErrors);
        setMessage("");

        // ถ้ามีช่องไหนผิด ให้หยุดส่งฟอร์ม
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name,
                contact,
                password: registerData.password,
            });

            localStorage.setItem("user-Storage", JSON.stringify({ count: 1, date: null }));
            setNotice("Account created. Log in to continue.");
            setIslogin(true);
        } catch (err) {
            setMessage(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="auth-title">Create an account</h1>
            <p className="auth-subtitle">Track how you feel and look back on it later.</p>

            <form onSubmit={handleSubmit} noValidate>
                <div className="auth-field-group">
                    <AuthField
                        label="Username"
                        value={registerData.name}
                        onChange={(name) => {
                            setRegisterData({ ...registerData, name });
                            if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        autoComplete="username"
                        hint="You will use this to log in."
                    />
                    {errors.name && <p className="auth-field-error">{errors.name}</p>}
                </div>

                <div className="auth-field-group">
                    <AuthField
                        label="Phone or email"
                        value={registerData.contact}
                        onChange={(contact) => {
                            setRegisterData({ ...registerData, contact });
                            if (errors.contact) setErrors({ ...errors, contact: undefined });
                        }}
                        autoComplete="email"
                    />
                    {errors.contact && <p className="auth-field-error">{errors.contact}</p>}
                </div>

                <div className="auth-field-group">
                    <AuthField
                        label="Password"
                        type="password"
                        value={registerData.password}
                        onChange={(password) => {
                            setRegisterData({ ...registerData, password });
                            if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        autoComplete="new-password"
                    />
                    {/* Password Policy Checklist */}
                    <ul className="auth-policy" aria-label="Password requirements">
                        <li className={pwdChecks.length ? "is-valid" : ""}>At least 8 characters</li>
                        <li className={pwdChecks.upper ? "is-valid" : ""}>At least 1 uppercase letter (A-Z)</li>
                        <li className={pwdChecks.lower ? "is-valid" : ""}>At least 1 lowercase letter (a-z)</li>
                        <li className={pwdChecks.number ? "is-valid" : ""}>At least 1 number (0-9)</li>
                    </ul>
                    {errors.password && <p className="auth-field-error">{errors.password}</p>}
                </div>

                <div style={{ marginTop: "18px", marginBottom: "20px" }}>
                    <div className="auth-check" style={{ marginBottom: 0 }}>
                        <input
                            id="auth-privacy"
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => {
                                setAgreed(e.target.checked);
                                if (errors.agreed) setErrors({ ...errors, agreed: undefined });
                            }}
                        />
                        <span>
                            <label htmlFor="auth-privacy">I agree to the </label>
                            <button
                                type="button"
                                className="auth-link"
                                onClick={() => dialogRef.current?.showModal()}
                            >
                                privacy information
                            </button>
                        </span>
                    </div>
                    {errors.agreed && <p className="auth-field-error">{errors.agreed}</p>}
                </div>

                {message && (
                    <p role="alert" className="auth-message">
                        {message}
                    </p>
                )}

                <button className="auth-submit" type="submit" disabled={loading}>
                    {loading ? "Creating account…" : "Create account"}
                </button>
            </form>

            <p className="auth-switch">
                Already have an account?{" "}
                <button
                    type="button"
                    className="auth-link"
                    onClick={() => {
                        setNotice("");
                        setIslogin(true);
                    }}
                >
                    Log in
                </button>
            </p>

            {/* Privacy Dialog */}
            <dialog
                ref={dialogRef}
                className="auth-dialog"
                aria-labelledby="privacy-title"
                onClick={(e) => {
                    // คลิกพื้นที่ด้านนอกกล่องเพื่อปิดได้
                    if (e.target === dialogRef.current) dialogRef.current.close();
                }}
            >
                <h2 id="privacy-title" className="auth-dialog-title">
                    Privacy information
                </h2>
                <p className="auth-dialog-text">Here is what Mood keeps and how it is used.</p>
                <ul className="auth-dialog-list">
                    <li>
                        <strong>Account details.</strong> Your username, your phone number or
                        email, and your password. The password is stored hashed, never as plain
                        text.
                    </li>
                    <li>
                        <strong>Check-ins.</strong> The mood, description, praise and lessons
                        you write are saved to your account and shown only when you are logged in.
                    </li>
                    <li>
                        <strong>Chat.</strong> Messages you send in Chat are sent to Google’s
                        Gemini AI so it can write a reply.
                    </li>
                    <li>You can change your username and password in Settings at any time.</li>
                </ul>
                <form method="dialog">
                    <button className="auth-submit is-secondary" type="submit">
                        Close
                    </button>
                </form>
            </dialog>
        </>
    );
}