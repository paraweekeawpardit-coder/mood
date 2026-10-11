
"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import "@/styles/Steak.css";

export default function Streak() {

    const [day, setDay] = useState(0);

    async function handleShow() {

        try {
            const rawData = localStorage.getItem("user-Storage") || "{}";
            const parsedData = JSON.parse(rawData);
            const count = parsedData.count || 0;
            setDay(count)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {

        handleShow();

        window.addEventListener("streakUpdated", handleShow);
        return () => {
            window.removeEventListener("streakUpdated", handleShow);
        };
    }, []);

return (

        <div className="streakCard">
            <div className="left">
                <img
                    src="/steak.png"
                    alt="day streak"
                />
            </div>

            <div className="right">
                <span className="label">
                    Day streak
                </span>
                <span className="day">
                    {day}
                </span>
            </div>
        </div>
    )
}