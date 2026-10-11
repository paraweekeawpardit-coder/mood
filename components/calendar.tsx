"use client"

import "@/styles/Calendar.css";

import { useState } from "react";
import { Dispatch, SetStateAction } from "react";

type Props = {
    setDate: Dispatch<SetStateAction<Date>>
}

export default function Calendar({ setDate }: Props) {

    const today = new Date();

    const [month, setMonth] = useState(
        today.getMonth()
    );

    const [year, setYear] = useState(
        today.getFullYear()
    );

    const [selectedDay, setSelectedDay] =
        useState(today.getDate());

    const firstDay =
        new Date(year, month, 1).getDay();

    const curMonth =
        new Date(year, month + 1, 0).getDate();

    const calendar = Array.from(
        {
            length: Math.ceil(
                (firstDay + curMonth) / 7
            )
        },
        () => new Array(7).fill(null)
    );

    let currentDay = 1;

    for (let i = 0; i < calendar.length; i++) {

        for (let j = 0; j < 7; j++) {

            if (i === 0 && j < firstDay) {
                continue;
            }

            if (currentDay > curMonth) {
                break;
            }

          calendar[i][j] = currentDay;

            currentDay++;
        }
    }

    function GetMonth(month: number) {

        const months = [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC"
        ];

        return months[month];
    }

    return (

        <div className="calendar-container">

            <div className="calendar-header">

                <button
                    className="month-btn"

                    onClick={() => {
                        if (month !== 0) {
                            setMonth(month - 1);
                        }else{
                            setMonth(11);
                            setYear(year-1);
                        }
                        console.log("month : ",month)
                    }}
                >
                    {"<"}
                </button>

                <p className="calendar-title">

                    <span>

                        {GetMonth(month)}

                    </span>

                    <span>

                        {" "}
                        {year}

                    </span>

                </p>

                <button
                    className="month-btn"

                    onClick={() => {
                        if (month < 11) {
                            setMonth(month + 1);
                        }else{
                            setMonth(0);
                            setYear(year+2);
                        }

                        console.log("month : ",month)
                        
                    }}
                >
                    {">"}
                </button>

            </div>

            <div className="week-row">
                {
                    [
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat"
                    ].map((d) => (

                        <span
                            key={d}
                            className="week-day"
                        >

                            {d}

                        </span>
                    ))
                }

            </div>
            {
                calendar.map((week, weekIndex) => (

                    <div
                        key={weekIndex}
                        className="calendar-row"
                    >

                        {
                            week.map((day, dayIndex) => {
                                
                                if (day === null) {

                                    return (

                                        <div
                                            key={dayIndex}
                                            className="empty-day"
                                        />

                                    )
                                }

                                const date = new Date(year,month,day);
                                const isFuture = date > today;

                                return (
                                    <div
                                        key={dayIndex}
                                        className={
                                            // about
                                            `calendar-day
                                            ${
                                                selectedDay === day
                                                ? "selected-day"
                                                : ""
                                            }
                                            ${
                                                isFuture
                                                ? "disabled-day"
                                                : ""
                                            }
                                        `}

                                        onClick={() => {

                                            if (!isFuture) {
                                                setSelectedDay(day);
                                                setDate(date);
                                            }
                                        }}
                                    >
                                        {String(day).padStart(2, "0")}
                                    </div>
                                )
                            })
                        }
                    </div>
                ))
            }
        </div>
    );
}

