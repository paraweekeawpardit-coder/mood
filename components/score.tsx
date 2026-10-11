"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import "@/styles/Score.css"

export default function Score() {
    console.log("function score")
    const [score, setScore] = useState(0);

    const [diff, setDiff] = useState({
        message: "",
        color: "gray"
    });

    async function handleShow() {

        console.log("handleShow score")

        try {

            const res = await axios.get(
                "http://localhost:5000/api/note/score",{
                 
                    withCredentials: true,
                    headers: {
                        token:`Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            console.log(res.data)
            if (res.data.month.totalScore !== undefined) {
                const currentScore =  res.data.month.totalScore;
                const previousScore = res.data.lastmonth.totalScore;

                setScore(currentScore);

                const difference = currentScore - previousScore;

                if (difference >= 0) {

                    setDiff({
                        message:
                            "+" +
                            difference.toFixed(1) +
                            " vs last month",
                        color: "green"
                    });

                } else {

                    setDiff({

                        message:
                            difference.toFixed(1) +
                            " vs last month",
                        color: "red"

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
            <span className="score-title">
                avg mood score
            </span>
            <span className="score-number">
                {score.toFixed(1)}
            </span>
            <span
                className="score-diff"
                style={{
                    color: diff.color
                }}
            >
                {diff.message}
            </span>
        </div>
    )
}