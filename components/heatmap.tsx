"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import "@/styles/heatmap.css";

export default function HeatMap() {

    type Mood = {
        date: Date,
        mood: string,
        color: string,
    }

    type Memo = {
        date: Date,
        mood: string
    }

    const [data, setData] =
        useState<Mood[]>([]);

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

    async function SetData() {

        try {

            const res = await axios.get(
                "https://mood-98v8.onrender.com/api/note/moodtrend",
                {
                    withCredentials: true,
                    headers: {
                        token: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            
            console.log(res.data);

            if (res.data) {

                const formatdata = res.data.map((item: Memo) => ({
                        date: item.date,
                        mood: item.mood,
                        color: MatchColor(item.mood)
                    }));

                setData(formatdata);
            }

        } catch (err) {

            console.log(err);

        }

    }

    useEffect(() => {
        SetData();
    }, []);

    const day = new Date();
    const monthName =day.toLocaleString("en-US",
            {
                month: "long"
            }
        );

    const firstDay =
        new Date(day.getFullYear(),day.getMonth(),1).getDay();

    const totalDays =new Date(day.getFullYear(),day.getMonth() + 1,0).getDate();

    const calendar = Array.from(
        {
            length:
                Math.ceil(
                    (firstDay + totalDays) / 7
                )
        },

        () => new Array(7).fill(null)
    );

    const moodByDate = new Map(
    data.map(item => {
        const [year, month, date] = (item.date as unknown as string)
            .split("T")[0]
            .split("-")
            .map(Number);
        const key = `${year}-${month - 1}-${date}`;
         console.log("data key:", key);
        return [key, item];
    })
    );

    let currentDay = 1;
    for (let i = 0; i < calendar.length; i++) {

        for (let j = 0; j < 7; j++) {

            if (i === 0 && j < firstDay) {
                continue;
            }

            if (currentDay > totalDays) {
                break;
            }

            const d = new Date(day.getFullYear(),day.getMonth(),currentDay);
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            calendar[i][j] = moodByDate.get(key) ?? null;

            currentDay++;
        }
    }

    return (

        <div className="heatmap-box">
            <h2 className="heatmap-title">
                mood heatmap — {monthName}
            </h2>

            <div className="weekday-row">
                <span>sun</span>
                <span>mon</span>
                <span>tue</span>
                <span>wed</span>
                <span>thu</span>
                <span>fri</span>
                <span>sat</span>
            </div>

            <div className="calendar-grid">
                {
                    calendar.map((week, weekIndex) => (

                        <div
                            className="week-row"
                            key={weekIndex}
                        >
                            {
                                week.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className="day-box"
                                        style={{
                                            backgroundColor:
                                                day?.color ||
                                                "#F5F5F5"
                                        }}
                                    >
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>

        </div>

    )
}