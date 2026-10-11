"use client";

import {
    Dispatch,
    SetStateAction,
    useState
} from "react";

import Loginform from "@/components/loginform";
import Registerform from "@/components/registerform";
import "./Auth.css";

type Props = {
    setAuth: Dispatch<SetStateAction<boolean>>
}

export default function Auth({ setAuth }: Props) {
    console.log("start");
    const [isLogin, setIslogin] = useState(true);
    console.log("isLogin:", isLogin)

    return (
        <div className="auth-page">

            <div className="auth-logo">
                <img
                    className="bar-logo"
                    src="/loco.png"
                    alt="logo"
                />
            </div>


            <div className="circle circle-blue-big" />
            <div className="circle circle-yellow-big" />
            <div className="circle circle-green" />
            <div className="circle circle-yellow-small" />
            <div className="circle circle-pink" />
            <div className="circle circle-blue-small" />
            <div className="circle circle-green-big" />
            <div className="circle circle-pink-big" />
            <div className="auth-form">

                {
                    isLogin ? (
                        <Loginform
                            setAuth={setAuth}
                            setIslogin={setIslogin}
                        />
                    ) : (

                        <Registerform
                            setIslogin={setIslogin}
                        />

                    )

                }

            </div>

        </div>
    );
}