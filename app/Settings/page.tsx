"use client";
import "@/styles/Settings.css";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Bar from "@/components/Bar";
import { API_URL, getToken, logout, USERNAME_EVENT } from "@/lib/auth";

const ENDPOINTS = {
    profile: `${API_URL}/auth/profile`,
    password: `${API_URL}/auth/password`,
};

type Status = { type: "ok" | "error"; text: string } | null;

async function put(url: string, body: Record<string, string>) {
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || data.message || "Something went wrong. Try again.");
    }
    return data;
}

function Message({ status }: { status: Status }) {
    if (!status) return null;
    return (
        <p role="status" className={`settings-message is-${status.type}`}>
            {status.text}
        </p>
    );
}

function EyeIcon({ open }: { open: boolean }) {
    return open ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export default function Settings() {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    const [currentName, setCurrentName] = useState("");
    const [name, setName] = useState("");
    const [savingName, setSavingName] = useState(false);
    const [nameStatus, setNameStatus] = useState<Status>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurPass, setShowCurPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConPass, setShowConPass] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordStatus, setPasswordStatus] = useState<Status>(null);

    useEffect(() => {
        if (!getToken()) {
            router.replace("/");
            return;
        }
        const stored = localStorage.getItem("username") || "";
        setCurrentName(stored);
        setName(stored);
        setReady(true);
    }, [router]);

    const saveName = async (e: FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();

        if (!trimmed) {
            setNameStatus({ type: "error", text: "Enter a name." });
            return;
        }
        if (trimmed === currentName) {
            setNameStatus({ type: "error", text: "That is already your name." });
            return;
        }

        setSavingName(true);
        setNameStatus(null);
        try {
            const data = await put(ENDPOINTS.profile, { name: trimmed });
            const saved = data.name ?? trimmed;
            localStorage.setItem("username", saved);
            if (data.token) localStorage.setItem("token", data.token);
            window.dispatchEvent(new Event(USERNAME_EVENT));
            setCurrentName(saved);
            setName(saved);
            setNameStatus({ type: "ok", text: "Profile name updated!" });
        } catch (err) {
            setNameStatus({ type: "error", text: (err as Error).message });
        } finally {
            setSavingName(false);
        }
    };

    const savePassword = async (e: FormEvent) => {
        e.preventDefault();

        if (!currentPassword) {
            setPasswordStatus({ type: "error", text: "Enter your current password." });
            return;
        }
        if (newPassword.length < 6) {
            setPasswordStatus({ type: "error", text: "New password must be at least 6 characters." });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordStatus({ type: "error", text: "New passwords do not match." });
            return;
        }

        setSavingPassword(true);
        setPasswordStatus(null);
        try {
            await put(ENDPOINTS.password, { currentPassword, newPassword });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordStatus({ type: "ok", text: "Password updated successfully!" });
        } catch (err) {
            setPasswordStatus({ type: "error", text: (err as Error).message });
        } finally {
            setSavingPassword(false);
        }
    };

    if (!ready) return null;

    return (
        <>
            <Bar />
            <main className="settings-page">
                <div className="settings-container">
                    {/* Profile Banner ด้านบน */}
                    <header className="settings-hero">
                        <div className="hero-profile">
                            <div className="hero-avatar" aria-hidden="true">
                                {(currentName || "U").charAt(0).toUpperCase()}
                            </div>
                            <div className="hero-text">
                                <h1>{currentName || "Account Settings"}</h1>
                                <p>Manage your personal profile, security, and session preferences.</p>
                            </div>
                        </div>
                        <div className="hero-badge">
                            <span className="hero-badge-dot" />
                            Active Account
                        </div>
                    </header>

                    {/* Section 1: Profile */}
                    <section className="settings-section" aria-labelledby="profile-heading">
                        <div className="settings-intro">
                            <span className="section-tag">General</span>
                            <h2 id="profile-heading">Display Name</h2>
                            <p>Your name is used to sign in and appears on your navigation bar.</p>
                        </div>
                        <form className="settings-form" onSubmit={saveName} noValidate>
                            <div className="field-group">
                                <label htmlFor="settings-name">Username</label>
                                <input
                                    id="settings-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="username"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="settings-actions">
                                <button
                                    type="submit"
                                    className="settings-btn is-primary"
                                    disabled={savingName || name.trim() === currentName}
                                >
                                    {savingName ? "Saving…" : "Save changes"}
                                </button>
                                <Message status={nameStatus} />
                            </div>
                        </form>
                    </section>

                    {/* Section 2: Security */}
                    <section className="settings-section" aria-labelledby="password-heading">
                        <div className="settings-intro">
                            <span className="section-tag">Security</span>
                            <h2 id="password-heading">Change Password</h2>
                            <p>Choose a strong password to keep your journal and mood records private.</p>
                        </div>
                        <form className="settings-form" onSubmit={savePassword} noValidate>
                            <div className="field-group">
                                <label htmlFor="settings-current">Current password</label>
                                <div className="input-wrapper">
                                    <input
                                        id="settings-current"
                                        className="has-toggle"
                                        type={showCurPass ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowCurPass((v) => !v)}
                                        aria-label="Toggle current password visibility"
                                    >
                                        <EyeIcon open={showCurPass} />
                                    </button>
                                </div>
                            </div>

                            <div className="field-group">
                                <label htmlFor="settings-new">New password</label>
                                <div className="input-wrapper">
                                    <input
                                        id="settings-new"
                                        className="has-toggle"
                                        type={showNewPass ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        autoComplete="new-password"
                                        placeholder="At least 6 characters"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowNewPass((v) => !v)}
                                        aria-label="Toggle new password visibility"
                                    >
                                        <EyeIcon open={showNewPass} />
                                    </button>
                                </div>
                                <span className={`password-hint${newPassword.length >= 6 ? " is-valid" : ""}`}>
                                    {newPassword.length >= 6 ? "✓ Minimum 6 characters met" : "• Minimum 6 characters required"}
                                </span>
                            </div>

                            <div className="field-group">
                                <label htmlFor="settings-confirm">Confirm new password</label>
                                <div className="input-wrapper">
                                    <input
                                        id="settings-confirm"
                                        className="has-toggle"
                                        type={showConPass ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="new-password"
                                        placeholder="Re-enter new password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowConPass((v) => !v)}
                                        aria-label="Toggle confirm password visibility"
                                    >
                                        <EyeIcon open={showConPass} />
                                    </button>
                                </div>
                            </div>

                            <div className="settings-actions">
                                <button
                                    type="submit"
                                    className="settings-btn is-primary"
                                    disabled={savingPassword}
                                >
                                    {savingPassword ? "Updating…" : "Update password"}
                                </button>
                                <Message status={passwordStatus} />
                            </div>
                        </form>
                    </section>

                    {/* Section 3: Session / Danger Zone */}
                    <section className="settings-section is-danger-zone" aria-labelledby="session-heading">
                        <div className="settings-intro">
                            <span className="section-tag is-danger">Session</span>
                            <h2 id="session-heading">Sign Out</h2>
                            <p>Log out from this browser. All your mood notes remain safely stored in your account.</p>
                        </div>
                        <div className="settings-form">
                            <div className="settings-actions">
                                <button type="button" className="settings-btn is-danger" onClick={logout}>
                                    Log out of account
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}