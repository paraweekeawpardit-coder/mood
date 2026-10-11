
"use client"

import axios from "axios";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import "@/styles/login.css";

type DateStack = {
    count:number,
    Lasdate:Date
}
type Props = {
    setAuth: Dispatch<SetStateAction<boolean>>
    setIslogin: Dispatch<SetStateAction<boolean>>
}

export default function Loginform({setAuth,setIslogin}: Props) {

    console.log("login")
    const [message, setMessage] = useState("");
    const [loginData, setLoginData] = useState({
        name: "",
        password: ""
    });
    const storageData = { count: 1, Date: null };

    
    async function handleSubmit() {

        try {

            const res = await axios.post(
            "http://localhost:5000/api/auth/login",
            loginData
            );

            if (res.data.token && res.data.id && res.data.name) {
                localStorage.setItem("token",res.data.token);
                localStorage.setItem("id",res.data.id);
                localStorage.setItem("username",res.data.name);
                
                const existingStorage = localStorage.getItem("user-Storage");
    
                if (!existingStorage) {
                    // ถ้ายังไม่มีข้อมูลอยู่เลย (เช่น เพิ่งเข้าใช้เครื่องนี้ครั้งแรก หรือเพิ่งสมัครใหม่) ค่อยสร้างค่าเริ่มต้นให้
                    const storageData = { count: 1, date: null }; // เปลี่ยนคีย์เป็น 'date' พิมพ์เล็กแล้ว
                    localStorage.setItem("user-Storage", JSON.stringify(storageData));
                }
                setAuth(true);
            } else {
                console.log("worng password")
                setMessage(res.data.error);
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (

        <div className="login-container">

            <h1 className="header">
                Log in
            </h1>

            <form
                className="login-form"
                onSubmit={(e) => { e.preventDefault(); handleSubmit();}}
            >

                <label className="label">
                    username
                </label>

                <input
                    className="blank"
                    type="text"
                    value={loginData.name}
                    onChange={(e) => {
                        console.log(e.target.value);
                        setLoginData({
                            ...loginData,
                            name: e.target.value
                        })
                    }}
                />

                <label className="label">
                    password
                </label>

                <input
                    className="blank"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => {
                        setLoginData({
                            ...loginData,
                            password: e.target.value
                        })
                    }}
                />

                <div className="remember-box">
                    <input type="checkbox" />
                    <span>
                        remember me
                    </span>
                </div>

                <p className="register-text">
                    if you don't have account please
                    <span 
                        className="register-link"
                        onClick={() => setIslogin(false)}
                        style={{ cursor: "pointer" }}
                    >
                        Register
                    </span>
                </p>

                <button
                    className="submit-btn"
                    type="submit"
                >
                    Log in
                </button>

                <button
                    type="button"
                    className="social-login"
                >
                    <img
                        src="/mail.png"
                        alt="gmail"
                    />
                    <span>
                        Log in with Gmail
                    </span>
                </button>

                <button
                    type="button"
                    className="social-login"
                >
                    <img
                        src="/line.webp"
                        alt="line"
                    />
                    <span>
                        Log in with Line
                    </span>
                </button>

                <button
                    type="button"
                    className="social-login"
                >
                    <img
                        src="/facebook.webp"
                        alt="facebook"
                    />
                    <span>
                        Log in with Facebook
                    </span>
                </button>

                <p className="message">
                    {message}
                </p>
            </form>
        </div>
    )
}