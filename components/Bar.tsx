"use client";
import "@/styles/Bar.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { logout, USERNAME_EVENT } from "@/lib/auth";

const NAV_ITEMS = [
    { href: "/Home", label: "Home" },
    { href: "/Tracker", label: "Mood tracker" },
    { href: "/Chat", label: "Chat" },
    { href: "/Overview", label: "Overview" },
];

export default function Bar() {
    const [username, setUsername] = useState("");
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        const sync = () => setUsername(localStorage.getItem("username") || "");
        sync();
        window.addEventListener(USERNAME_EVENT, sync);
        return () => window.removeEventListener(USERNAME_EVENT, sync);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, [open]);

// เปลี่ยนเฉพาะส่วน return ใน Bar.tsx (บรรทัดที่ 41 เป็นต้นไป)
    return (
        <div className="bar-wrapper">
            <header className="bar-container">
                <div className="bar-left">
                    <Link href="/Home" className="bar-logo-link" aria-label="Go to home">
                        <img className="bar-logo" src="/loco.png" alt="Logo" />
                    </Link>

                    <nav className="bar-nav" aria-label="Main">
                        <ul className="bar-menu">
                            {NAV_ITEMS.map(({ href, label }) => {
                                const active = pathname?.startsWith(href);
                                return (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            className={`bar-link${active ? " is-active" : ""}`}
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                <div className="bar-right" ref={menuRef}>
                    <button
                        type="button"
                        className="bar-profile"
                        aria-haspopup="true"
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                    >
                        {username ? (
                            <span className="bar-avatar" aria-hidden="true">
                                {username.charAt(0).toUpperCase()}
                            </span>
                        ) : (
                            <img className="bar-account" src="/account.png" alt="Account" />
                        )}
                        <span className="bar-username">{username || "Account"}</span>
                        <svg
                            className={`bar-chevron${open ? " is-open" : ""}`}
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    {open && (
                        <div className="bar-dropdown">
                            {username && (
                                <div className="bar-dropdown-head">
                                    <span className="bar-dropdown-label">Signed in as</span>
                                    <span className="bar-dropdown-name">{username}</span>
                                </div>
                            )}
                            <Link href="/Settings" className="bar-dropdown-item">
                                Settings
                            </Link>
                            <button
                                type="button"
                                className="bar-dropdown-item is-danger"
                                onClick={() => { setOpen(false); logout(); }}
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
}