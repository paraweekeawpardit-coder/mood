"use client";
import { useId, useState } from "react";

type Props = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: "text" | "password";
    autoComplete?: string;
    hint?: string;
};

export default function AuthField({
    label,
    value,
    onChange,
    type = "text",
    autoComplete,
    hint,
}: Props) {
    const id = useId();
    const [shown, setShown] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="auth-field">
            <label className="auth-label" htmlFor={id}>
                {label}
            </label>
            <div className="auth-input-wrap">
                <input
                    id={id}
                    className={`auth-input${isPassword ? " has-toggle" : ""}`}
                    type={isPassword && shown ? "text" : type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete={autoComplete}
                    aria-describedby={hint ? `${id}-hint` : undefined}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="auth-toggle"
                        onClick={() => setShown((v) => !v)}
                        aria-pressed={shown}
                        aria-label={shown ? "Hide password" : "Show password"}
                    >
                        {shown ? "Hide" : "Show"}
                    </button>
                )}
            </div>
            {hint && (
                <p id={`${id}-hint`} className="auth-hint">
                    {hint}
                </p>
            )}
        </div>
    );
}