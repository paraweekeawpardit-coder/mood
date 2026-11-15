"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import "../styles/setting-dropdown.css";

export default function Setting() {
    const router = useRouter();
    const [username, setUsername] = useState("User");

    useEffect(() => {
        const stored = localStorage.getItem("username");
        if (stored) setUsername(stored);
    }, []);

    return (
        <div className="setting-dropdown">
            <div className="setting-profile">
                <div className="profile-avatar">
                    <img src="/account.png" alt="account" />
                </div>
                <div className="profile-info">
                    <p className="profile-name">{username}</p>
                    <span className="profile-role">Personal Journal</span>
                </div>
            </div>

            <div className="setting-divider" />

            <button
                type="button"
                className="setting-item"
                onClick={() => router.push("/settings")}
            >
                <img src="/setting.png" alt="setting" />
                <span>Settings</span>
            </button>

            <button
                type="button"
                className="setting-item"
                onClick={() => router.push("/help")}
            >
                <img src="/question.png" alt="question" />
                <span>Privacy & Help</span>
            </button>

            <div className="setting-divider" />

            <button
                type="button"
                className="setting-item is-logout"
                onClick={logout}
            >
                <img src="/logout.png" alt="logout" />
                <span>Log out</span>
            </button>
        </div>
    );
}