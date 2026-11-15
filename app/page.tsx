"use client";
import { useEffect, useState } from "react";
import Auth from "@/app/Auth/page";
import Home from "@/app/Home/page";
import { hasRememberedSession } from "@/lib/auth";

export default function Main() {
    const [isAuth, setAuth] = useState(false);
    const [checked, setChecked] = useState(false);

    // ถ้าเคยติ๊ก "Keep me logged in" ให้เข้า Home เลย ไม่ต้อง login ใหม่
    useEffect(() => {
        setAuth(hasRememberedSession());
        setChecked(true);
    }, []);

    // รอเช็ก session ก่อน เพื่อไม่ให้หน้า login แวบขึ้นมา
    if (!checked) return null;

    return isAuth ? <Home /> : <Auth setAuth={setAuth} />;
}