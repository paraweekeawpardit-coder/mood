"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Loginform from "@/components/loginform";
import Registerform from "@/components/registerform";
import "./Auth.css";

type Props = {
    setAuth: Dispatch<SetStateAction<boolean>>;
};

export default function Auth({ setAuth }: Props) {
    const [isLogin, setIslogin] = useState(true);
    // ข้อความแจ้งหลังสมัครสำเร็จ แสดงที่หน้า login
    const [notice, setNotice] = useState("");

    return (
        <div className="auth-page">
            <aside className="auth-aside">
                <img className="auth-logo" src="/loco.png" alt="Mood" />

                {/* วงกลมสี = อารมณ์ของแบรนด์ เป็นภาพประกอบเฉย ๆ */}
                <div className="auth-moods" aria-hidden="true">
                    <span className="auth-mood is-blue" />
                    <span className="auth-mood is-yellow" />
                    <span className="auth-mood is-green" />
                    <span className="auth-mood is-pink" />
                </div>

                <p className="auth-tagline">Check in with yourself, one day at a time.</p>
            </aside>

            <main className="auth-main">
                <div className="auth-form">
                    {isLogin ? (
                        <Loginform
                            setAuth={setAuth}
                            setIslogin={setIslogin}
                            notice={notice}
                            setNotice={setNotice}
                        />
                    ) : (
                        <Registerform setIslogin={setIslogin} setNotice={setNotice} />
                    )}
                </div>
            </main>
        </div>
    );
}