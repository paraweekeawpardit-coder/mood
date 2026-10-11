
"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import "@/styles/distribution.css"

export default function Distribution() {

    type MoodType = {
        _id: string;
        count: number;
    }

    const [mood, setMood] = useState<MoodType[]>([]);
    const [total,setTotal] = useState(0);

    async function handleShow() {

        try {

            // about header why must have
            const res = await axios.get(
                "http://localhost:5000/api/note/moodStat",
                {
                    withCredentials: true,
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            console.log(res.data);
            if (res.data) {
                setMood(res.data);
                const total = res.data.reduce((sum: number, item: MoodType) => {
                    return sum + item.count;
                }, 0);

                setTotal(total);
            }
        } catch (err) {
            console.log(err);

        }
    }

    // aboute  
    // เดิม:
    // handleShow()
    //
    // ปัญหา:
    // render -> fetch
    // fetch -> setState
    // setState -> render ใหม่
    // render ใหม่ -> fetch ใหม่
    //
    // วนลูปไม่จบ
    //
    // ต้องใช้ useEffect
    // ------------------------------------------
    useEffect(() => {

        handleShow();

    }, []);

    return (

         <div className="distribution-box">

            <h2 className="distribution-title">
                mood distribution
             </h2>
            {
                mood.length === 0 && (
                    <p className="no-data">
                        not have any information
                    </p>
                )
            }
            {
                mood.map((item, index) => (

                    <div
                        className="distribution-item"
                        key={index}
                    >
                        <span className="mood-name">
                            {item._id}
                        </span>
                        <span className="distribution-percent">
                            {((item.count / total) * 100).toFixed(0)}%
                        </span>
                    </div>
                ))
            }
        </div>
    )
}