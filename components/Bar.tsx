"use client"
import "@/styles/Bar.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Bar() {
    const [username, setUsername] = useState("");
    const router = useRouter()

    useEffect(() => {
        setUsername(localStorage.getItem("username") || "");
    }, []);

    return (
        <div className="bar-container">
            <div className="bar-left">
                <img
                    className="bar-logo"
                    src="/loco.png"
                    alt="logo"
                    onClick={() => router.push("/Home")}
                />
                <ul className="bar-menu">
                    <li>
                        <Link href="/Tracker">mood tracker</Link>
                    </li>
                    <li>
                        <Link href="/Chat">chat</Link>
                    </li>
                    <li>
                        <Link href="/Overview">overview</Link>
                    </li>
                </ul>
            </div>

            <div className="bar-right">
                <span className="bar-username">{username}</span>
                <img
                    className="bar-account"
                    src="/account.png"
                    alt="account"
                />
            </div>
        </div>
    );
}