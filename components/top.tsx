"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import "@/styles/top.css";

export default function TopMood() {

    const [mood, setMood] = useState("no data");

    async function handleShow() {

        try {

            const res = await axios.get("https://mood-98v8.onrender.com/api/note/topmood",
                {
                    withCredentials: true,
                    headers: {
                        token:`Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            console.log(res.data)

            if (res.data) {
                setMood(res.data._id);
            }

        } catch (err) {
            console.log(err);
        }

    }

        function MatchColor(mood: string) {

        switch (mood) {

            case "very good":
                return "#C0F5BE";

            case "great":
                return "#FCFDBE";

            case "meh":
                return "#FFE1A9";

            case "mad":
                return "#FCD6EF";

            case "sad":
                return "#CFFAFF";

            case "anxious":
                return "#EBDFF6";

            default:
                return "#F5F5F5";
        }
    }

    useEffect(() => {
        handleShow();
    }, []);

     return (
        <div className="moodCard">
            <span className="title">
                top mood
            </span>
            <div className="circle" style={{ backgroundColor: MatchColor(mood) }}></div>
            <span className="moodText">
                {mood}
            </span>
        </div>
    )
}