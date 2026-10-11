"use client"
import { useState } from "react";
import Bar from "@/components/Bar";
import Note from "@/components/note";
import Calendar from "@/components/calendar";
import "./Tracker.css"

export default function Tracker() {

    const [date, setDate] = useState<Date>(new Date());

    return (
        // CHANGE: เพิ่ม .tracker-page wrapper ครอบทั้งหมด
        <div className="tracker-page">

            {/* CHANGE: Bar อยู่ใน .tracker-navbar ให้ sticky ด้านบน */}
            <div className="tracker-navbar">
                <Bar />
            </div>

            {/* CHANGE: .tracker-content เป็น 2 คอลัมน์ — note ซ้าย calendar ขวา */}
            <div className="tracker-content">

                <div className="tracker-note">
                    <Note date={date} />
                </div>

                <div className="tracker-calendar">
                    <Calendar setDate={setDate} />
                </div>

            </div>

        </div>
    );
}