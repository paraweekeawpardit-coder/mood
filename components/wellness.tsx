"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import "@/styles/wellness.css"

export default function Wellness() {

    const [score, setScore] = useState(0);

    async function handleShow() {

        try {
            
            const res = await axios.get(
                "https://mood-98v8.onrender.com/api/note/score",
                {
                    withCredentials: true,
                    headers: {
                        token:`Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            console.log(res.data);

            if (res.data.month.totalScore !== undefined) {
                const currentScore =  res.data.month.totalScore;

                setScore((currentScore/5)*100);

            } else {
                setScore(0);
            }

        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        console.log("useEffect ran")
        handleShow();
    }, []);

    return (
        <div className="wellness-container">

            <div className="wellness-left">

                <img
                    src="/wellness.png"
                    alt="wellness score"
                    className="wellness-image"
                />

            </div>

            <div className="wellness-right">
                <span className="wellness-title">
                    Wellness score
                </span>
                <span className="wellness-score">
                    {Math.round(score)}%
                </span>

            </div>

        </div>
    )

}