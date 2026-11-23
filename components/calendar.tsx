"use client"

import "@/styles/Calendar.css";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";

type Props = {
    selectedDate?: Date;
    setDate: Dispatch<SetStateAction<Date>>;
    refreshKey?: number;
};

type MoodNote = {
    date: string;
    mood: string;
};

export default function Calendar({ selectedDate, setDate, refreshKey = 0 }: Props) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [internalSelected, setInternalSelected] = useState<Date>(today);
    const [moodMap, setMoodMap] = useState<Record<string, string>>({});

    // ใช้ selectedDate จาก props ถ้ามี หรือใช้ state ภายในถ้าไม่ได้ส่งมา
    const activeDate = selectedDate || internalSelected;

    // ดึงข้อมูลสีอารมณ์ของเดือนและปีที่กำลังเปิดดู
    useEffect(() => {
        async function fetchMonthMoods() {
            try {
                const res = await axios.get("https://mood-98v8.onrender.com/api/note/monthmoods", {
                    withCredentials: true,
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    params: { month, year },
                });

                const map: Record<string, string> = {};
                if (Array.isArray(res.data)) {
                    res.data.forEach((item: MoodNote) => {
                        const d = new Date(item.date);
                        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                        // แปลง "very good" -> "verygood" ให้ตรงกับชื่อ class ใน Calendar.css
                        map[key] = item.mood.replace(/\s+/g, "");
                    });
                }
                setMoodMap(map);
            } catch (err) {
                console.error("Failed to fetch month moods:", err);
            }
        }

        fetchMonthMoods();
    }, [month, year, refreshKey]);

    const firstDay = new Date(year, month, 1).getDay();
    const curMonth = new Date(year, month + 1, 0).getDate();

    const calendar = Array.from(
        { length: Math.ceil((firstDay + curMonth) / 7) },
        () => new Array(7).fill(null)
    );

    let currentDay = 1;
    for (let i = 0; i < calendar.length; i++) {
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) continue;
            if (currentDay > curMonth) break;
            calendar[i][j] = currentDay;
            currentDay++;
        }
    }

    function GetMonth(m: number) {
        const months = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];
        return months[m];
    }

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button
                    className="month-btn"
                    onClick={() => {
                        if (month !== 0) {
                            setMonth(month - 1);
                        } else {
                            setMonth(11);
                            setYear(year - 1);
                        }
                    }}
                >
                    {"<"}
                </button>

                <p className="calendar-title">
                    <span>{GetMonth(month)}</span>
                    <span> {year}</span>
                </p>

                <button
                    className="month-btn"
                    onClick={() => {
                        if (month < 11) {
                            setMonth(month + 1);
                        } else {
                            setMonth(0);
                            setYear(year + 1); // แก้จาก year + 2 เป็น year + 1
                        }
                    }}
                >
                    {">"}
                </button>
            </div>

            <div className="week-row">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <span key={d} className="week-day">
                        {d}
                    </span>
                ))}
            </div>

            {calendar.map((week, weekIndex) => (
                <div key={weekIndex} className="calendar-row">
                    {week.map((day, dayIndex) => {
                        if (day === null) {
                            return <div key={dayIndex} className="empty-day" />;
                        }

                        const cellDate = new Date(year, month, day);
                        cellDate.setHours(0, 0, 0, 0);

                        const isFuture = cellDate > today;
                        const isSelected =
                            activeDate.getDate() === day &&
                            activeDate.getMonth() === month &&
                            activeDate.getFullYear() === year;

                        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const moodClass = moodMap[dateKey] ? `mood-day-${moodMap[dateKey]}` : "";

                        return (
                            <div
                                key={dayIndex}
                                className={`calendar-day ${moodClass} ${isSelected ? "selected-day" : ""} ${isFuture ? "disabled-day" : ""}`}
                                onClick={() => {
                                    if (!isFuture) {
                                        setInternalSelected(cellDate);
                                        setDate(cellDate);
                                    }
                                }}
                            >
                                {String(day).padStart(2, "0")}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}