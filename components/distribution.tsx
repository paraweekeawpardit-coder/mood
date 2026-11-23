
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
                "https://mood-98v8.onrender.com/api/note/moodStat",
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

    function getMoodColor(moodName: string) {
        switch (moodName) {
            case "very good": return "#8ce99a";
            case "great":     return "#ffe066";
            case "meh":       return "#ffc078";
            case "mad":       return "#ffa8c5";
            case "sad":       return "#74c0fc";
            case "anxious":   return "#b197fc";
            default:          return "#cbd5e1";
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
            <h2 className="distribution-title">Mood Distribution</h2>
            {mood.length === 0 ? (
                <p className="no-data">No mood data yet</p>
            ) : (
                <div className="distribution-list">
                    {mood.map((item, index) => {
                        const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
                        const color = getMoodColor(item._id);
                        return (
                            <div className="distribution-item" key={index}>
                                <div className="distribution-row-top">
                                    <div className="mood-label-wrap">
                                        <span className="mood-dot" style={{ backgroundColor: color }} />
                                        <span className="mood-name">{item._id}</span>
                                    </div>
                                    <span className="distribution-percent">{percent}%</span>
                                </div>
                                <div className="progress-track">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${percent}%`, backgroundColor: color }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}