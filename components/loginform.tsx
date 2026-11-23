"use client";

import axios from "axios";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import AuthField from "../components/Authfield";
import { API_URL, getErrorMessage } from "@/lib/auth";

type Props = {
    setAuth: Dispatch<SetStateAction<boolean>>;
    setIslogin: Dispatch<SetStateAction<boolean>>;
    notice: string;
    setNotice: Dispatch<SetStateAction<string>>;
};

const SOCIALS = [
    { src: "/mail.png", label: "Gmail" },
    { src: "/line.webp", label: "Line" },
    { src: "/facebook.webp", label: "Facebook" },
];

export default function Loginform({ setAuth, setIslogin, notice, setNotice }: Props) {
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<{ name?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loginData, setLoginData] = useState({ name: "", password: "" });

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (loading) return;

        const name = loginData.name.trim();
        const newErrors: { name?: string; password?: string } = {};

        if (!name) newErrors.name = "Please enter your username.";
        if (!loginData.password) newErrors.password = "Please enter your password.";

        setErrors(newErrors);
        setMessage("");
        setNotice("");

        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            const res = await axios.post(`https://mood-98v8.onrender.com/auth/login`, {
                name,
                password: loginData.password,
            });

            const { token, id, name: savedName } = res.data;
            if (!token || !id || !savedName) {
                setMessage(res.data.error || "Log in failed. Try again.");
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("id", id);
            localStorage.setItem("username", savedName);

            if (remember) {
                localStorage.setItem("remember", "1");
            } else {
                localStorage.removeItem("remember");
            }

            if (!localStorage.getItem("user-Storage")) {
                localStorage.setItem("user-Storage", JSON.stringify({ count: 1, date: null }));
            }
            setAuth(true);
        } catch (err) {
            setMessage(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="auth-title">Log in</h1>
            <p className="auth-subtitle">Welcome back. Pick up where you left off.</p>

            {notice && (
                <p role="status" className="auth-notice">
                    {notice}
                </p>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className="auth-field-group">
                    <AuthField
                        label="Username"
                        value={loginData.name}
                        onChange={(name) => {
                            setLoginData({ ...loginData, name });
                            if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        autoComplete="username"
                    />
                    {errors.name && <p className="auth-field-error">{errors.name}</p>}
                </div>

                <div className="auth-field-group">
                    <AuthField
                        label="Password"
                        type="password"
                        value={loginData.password}
                        onChange={(password) => {
                            setLoginData({ ...loginData, password });
                            if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        autoComplete="current-password"
                    />
                    {errors.password && <p className="auth-field-error">{errors.password}</p>}
                </div>

                <label className="auth-check" style={{ marginTop: "16px" }}>
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span>Keep me logged in on this device</span>
                </label>

                {message && (
                    <p role="alert" className="auth-message">
                        {message}
                    </p>
                )}

                <button className="auth-submit" type="submit" disabled={loading}>
                    {loading ? "Logging in…" : "Log in"}
                </button>
            </form>

            <div className="auth-divider">
                <span>or continue with</span>
            </div>

            <div className="auth-socials">
                {SOCIALS.map(({ src, label }) => (
                    <button
                        key={label}
                        type="button"
                        className="auth-social"
                        disabled
                        title="Coming soon"
                    >
                        <img src={src} alt="" />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
            <p className="auth-hint auth-hint-center">Social login is coming soon.</p>

            <p className="auth-switch">
                Don’t have an account?{" "}
                <button
                    type="button"
                    className="auth-link"
                    onClick={() => {
                        setNotice("");
                        setIslogin(false);
                    }}
                >
                    Create an account
                </button>
            </p>
        </>
    );
}