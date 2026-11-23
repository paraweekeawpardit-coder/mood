"use client";

import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell
} from "recharts";
import { useEffect, useState } from "react";
import "@/styles/week.css";

export default function Week() {
    type Mood = {
        score?: number;
        date: string;
        mood: string;
    };

    type ChartData = {
        day: string;
        mood: number;
        realScore: number | null;
        moodLabel: string;
        color: string;
    };

    const [data, setData] = useState<ChartData[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    function MatchColor(mood: string) {
        switch (mood) {
            case "very good": return "#C0F5BE";
            case "great":     return "#FCFDBE";
            case "meh":       return "#FFE1A9";
            case "mad":       return "#FCD6EF";
            case "sad":       return "#CFFAFF";
            case "anxious":   return "#EBDFF6";
            default:          return "#f1f5f9";
        }
    }

    function MoodToScore(mood: string, score?: number): number {
        if (typeof score === "number" && score > 0) return score;
        switch (mood) {
            case "very good": return 5;
            case "great":     return 4;
            case "meh":       return 3;
            case "mad":       return 2;
            case "sad":       return 1;
            case "anxious":   return 1;
            default:          return 0;
        }
    }

    async function GenChat(text: string) {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "https://mood-98v8.onrender.com/api/chat/chat",
                { text },
                {
                    withCredentials: true,
                    headers: {
                        authorization: `Bearer ${token}`,
                        token: `Bearer ${token}`,
                    },
                }
            );
            if (res.data?.message) {
                setMessage(res.data.message);
            }
        } catch (err) {
            console.log("Chat summary skipped:", err);
        }
    }

    async function fetchData() {
        const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

        const fullWeek: ChartData[] = weekDays.map((day) => ({
            day,
            mood: 0.3,
            realScore: null,
            moodLabel: "No data",
            color: "#f1f5f9",
        }));

        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "http://localhost:5000/api/note/weekStat",
                {
                    withCredentials: true,
                    headers: {
                        authorization: `Bearer ${token}`,
                        token: `Bearer ${token}`,
                    },
                }
            );

            if (Array.isArray(res.data)) {
                res.data.forEach((item: Mood) => {
                    const itemDate = new Date(item.date);
                    const jsDay = itemDate.getDay();
                    const scoreVal = MoodToScore(item.mood, item.score);

                    fullWeek[jsDay] = {
                        day: weekDays[jsDay],
                        mood: scoreVal > 0 ? scoreVal : 0.3,
                        realScore: scoreVal,
                        moodLabel: item.mood,
                        color: MatchColor(item.mood),
                    };
                });
            }
        } catch (err) {
            console.log("Week fetch error:", err);
        }

        setData(fullWeek);
        setLoading(false);

        const text = fullWeek
            .map((item) => `วัน ${item.day}: ${item.realScore === null ? "ไม่มีข้อมูล" : `${item.moodLabel} (ระดับ ${item.realScore}/5)`}`)
            .join("\n");

        const finalText = `${text}\n\nนี่คือข้อมูลอารมณ์ของสัปดาห์นี้ ช่วยสรุปหรือให้คำแนะนำสั้น ๆ ไม่เกิน 50 คำ ถ้าไม่มีข้อมูลเลยให้บอกว่ายังไม่มีข้อมูลในสัปดาห์นี้`;

        await GenChat(finalText);
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="week-container">
            <div className="week-header">
                <div className="week-insight">
                    <span className="insight-dot" aria-hidden="true" />
                    <p className="insight-text">
                        {message || "Track your mood daily to unlock your weekly reflection."}
                    </p>
                </div>
            </div>

            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                        data={data}
                        margin={{ top: 12, right: 8, left: -28, bottom: 0 }}
                        barSize={42}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                        />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            domain={[0, 5]}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: "#f8fafc", radius: 12 }}
                            formatter={(_value: any, _name: any, props: any) => {
                                const payload = props.payload as ChartData;
                                return [
                                    payload.realScore ? `${payload.moodLabel} (${payload.realScore}/5)` : "No record",
                                    "Mood",
                                ];
                            }}
                            contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
                                fontSize: "13px",
                                fontWeight: 700,
                            }}
                        />
                        <Bar dataKey="mood" radius={[12, 12, 12, 12]}>
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}