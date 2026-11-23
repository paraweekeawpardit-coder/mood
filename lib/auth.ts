import axios from "axios";

// Base URL ของ backend (ตรงกับที่ฟอร์ม login/register เรียกอยู่: /api/auth/...)
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://mood-98v8.onrender.com/api";

// Keys ที่เก็บตอน login ถ้าชื่อไม่ตรงให้แก้ที่นี่ที่เดียว
export const AUTH_KEYS = ["token", "username", "id", "remember"];

// Bar listens to this event so the name in the top bar updates right after a rename
export const USERNAME_EVENT = "username-changed";

export function getToken(): string | null {
    return localStorage.getItem("token");
}

export function clearSession() {
    AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
}

// ลบ session แล้วโหลดหน้าแรกใหม่ทั้งหน้า
// (ใช้ reload เพื่อให้ state isAuth ใน app/page.tsx ถูกรีเซ็ตแน่นอน แม้จะอยู่ที่ "/" อยู่แล้ว)
export function logout() {
    clearSession();
    window.location.replace("/");
}

function tokenIsValid(token: string | null): boolean {
    if (!token) return false;
    try {
        const payload = JSON.parse(
            atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

// ใช้ตอนเปิดเว็บ: ถ้าเคยติ๊ก "Keep me logged in" และ token ยังไม่หมดอายุ ให้เข้าได้เลย
export function hasRememberedSession(): boolean {
    if (localStorage.getItem("remember") !== "1") return false;
    if (tokenIsValid(getToken())) return true;
    clearSession(); // token หมดอายุแล้ว
    return false;
}

// axios จะ throw เมื่อ backend ตอบ 4xx/5xx จึงต้องอ่านข้อความจาก err.response
export function getErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        if (err.response) {
            const data = err.response.data as { error?: string; message?: string } | undefined;
            return data?.error || data?.message || "Something went wrong. Try again.";
        }
        return "Can’t reach the server. Check your connection and try again.";
    }
    return "Something went wrong. Try again.";
}