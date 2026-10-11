"use client"
import { useEffect, useState } from "react";

export default function Setting(){

    return(
        <div className="setting">
            <div className="profile">
                <img  src="/account.png" alt="account" />
                <p>{localStorage.getItem("username")}</p>
            </div>
            <div>
                <img  src="/setting.png" alt="setting" />
                <p>setting</p>
            </div>
            <div>
                <img src="/question.png" alt="question" />
                <p>privacy and help</p>
            </div>
            <div>
                <img src="logout.png" alt="logout" />
                <p>log out</p> 
            </div>
        </div>
    )
}