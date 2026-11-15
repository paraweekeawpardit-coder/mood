"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import "@/styles/Score.css"

export default function Score() {
    const [score, setScore] = useState(0);
    const [diff, setDiff] = useState({
        message: "No previous data",
        status: "is-neutral"
    });

    async function handleShow() {
        try {
            const res = await axios.get("http://localhost:5000/api/note/score", {
                withCredentials: true,
                headers: {
                    token: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (res.data.month.totalScore !== undefined) {
                const currentScore = res.data.month.totalScore;
                const previousScore = res.data.lastmonth.totalScore;

                setScore(currentScore);
                const difference = currentScore - previousScore;

                if (difference >= 0) {
                    setDiff({
                        message: `+${difference.toFixed(1)} vs last month`,
                        status: "is-positive"
                    });
                } else {
                    setDiff({
                        message: `${difference.toFixed(1)} vs last month`,
                        status: "is-negative"
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleShow();
    }, []);

    return (
        <div className="score-card">
            <div className="score-header">
                <span className="score-title">Avg Mood Score</span>
            </div>
            <div className="score-body">
                <span className="score-number">{score.toFixed(1)}</span>
                <span className={`score-diff ${diff.status}`}>
                    {diff.message}
                </span>
            </div>
        </div>
    )
}