"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import "@/styles/Lesson.css";

export default function Lesson() {

    const [data, setData] = useState<string[]>([]);

    async function handleShow() {
        console.log("handle show work")
        try {

            const res = await axios.get(
                "https://mood-98v8.onrender.com/api/note/lesson",
                {
                    withCredentials: true,
                    headers: {
                        token:`Bearer ${localStorage.getItem("token")}`
                    }
                }
                
            );

            console.log("after res")
            
            if (res.data) {
                setData(res.data);
                
            } else {
                console.log("not have any response : ");
                console.log(res.data.error);
            }

            console.log("end show")

        } catch (err) {

            console.log("have error")

            console.log(err);
        }
    }

    useEffect(() => {
        handleShow();
    }, []);

    return (

        <div className="lesson-box">
            <p className="lesson-title">
                What I have learned
            </p>
            {
                data.length === 0 && (
                    <p className="no-lesson">
                        no lesson data
                    </p>
                )
            }

            <div className="lesson-scroll">
                {
                    data.map((item, index) => (
                        <div
                            className="lesson-item"
                            key={index}
                        >
                            {item}
                        </div>
                    ))
                }

            </div>
        </div>
    )
}