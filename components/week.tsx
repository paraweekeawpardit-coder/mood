// "use client";

// import axios from "axios";

// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     Tooltip,
//     ResponsiveContainer,
//     CartesianGrid,
//     Cell
// } from "recharts";

// import { useEffect, useState } from "react";

// import "@/styles/week.css";

// export default function Week() {

//     type Mood = {
//         score: number,
//         date: string,
//         mood:string
//     }

//     type ChartData = {
//         day: string,
//         mood: number | null,
//         color: string | null
//     }

//     const [data, setData] = useState<ChartData[]>([]);

//     const [message, setMessage] =useState("");

//     const [loading, setLoading] =useState(true);

//     function MatchColor(mood: string) {

//         switch (mood) {

//             case "very good":
//                 return "#C0F5BE";

//             case "great":
//                 return "#FCFDBE";

//             case "meh":
//                 return "#FFE1A9";

//             case "mad":
//                 return "#FCD6EF";

//             case "sad":
//                 return "#CFFAFF";

//             case "anxious":
//                 return "#EBDFF6";

//             default:
//                 return "#F5F5F5";
//         }
//     }

//     async function GenChat(text: string) {

//         try {
//             const res = await axios.post(
//             "http://localhost:5000/api/chat/chat",

//             {
//                 text:text
//             },

//             {
//                 withCredentials:true,

//                 headers:{
//                    authorization:`Bearer ${localStorage.getItem("token")}`
//                 }
//             }
//             );

//             console.log(res.data.message)

//             if (res.data.message) {
//                 setMessage(res.data.message);
//             }

//         } catch (err) {

//             console.log(err);

//         }
//     }

//     async function fetchData() {

//         try {

//             const res = await axios.get(
//                 "http://localhost:5000/api/note/weekStat",
//                 {
//                     headers: {
//                         token:`Bearer ${localStorage.getItem("token")}`
//                     }
//                 }
//             );

//             const weekDays = [
//                 "SUN",
//                 "MON",
//                 "TUE",
//                 "WED",
//                 "THU",
//                 "FRI",
//                 "SAT"
//             ];

//             const fullWeek: ChartData[] =
//                 weekDays.map((day) => ({
//                     day,
//                     mood: null,
//                     color: null
//                 }));

//             res.data.forEach((item: Mood) => {

//                 const itemDate = new Date(item.date);
//                 const jsDay = itemDate.getDay();

//                 fullWeek[jsDay].mood = item.score;
//                 fullWeek.[jsDay].color = MatchColor(item.mood)
//             });

//             setData(fullWeek);

//             const text = fullWeek.map((item) => {

//                 return `
//                     วัน ${item.day}
//                     ${
//                         item.mood === null
//                             ? "ไม่มีข้อมูล"
//                             : `อารมณ์ระดับ ${item.mood}`
//                     }
//                 `;

//             }).join("\n");

//             const finalText =
//                 text +
//                 `
//                 นี่คือข้อมูลอารมณ์ของสัปดาห์นี้
//                 ช่วยสรุปหรือให้คำแนะนำสั้น ๆ
//                 ไม่เกิน 50 คำ
//                 ถ้าไม่มีข้อมูลให้บอกว่าไม่มีข้อมูล
//                 `;

//             await GenChat(finalText);

//         } catch (err) {

//             console.log(err);

//         } finally {

//             setLoading(false);
//         }
//     }

//     useEffect(() => {
//         fetchData();
//     }, []);

//     if (loading) {

//         return (
//             <div className="loading">
//                 Loading...
//             </div>
//         )
//     }

//     return (

//         <div className="week-container">

//             <div className="chart-wrapper">

//                 <ResponsiveContainer
//                     width="100%"
//                     height={320}
//                 >

//                     <BarChart
//                         data={data}
//                         margin={{
//                             top: 20,
//                             right: 10,
//                             left: 0,
//                             bottom: 0
//                         }}
//                     >

//                         <CartesianGrid
//                             strokeDasharray="3 3"
//                             vertical={false}
//                         />

//                         <XAxis
//                             dataKey="day"
//                             axisLine={false}
//                             tickLine={false}
//                         />

//                         <YAxis
//                             domain={[0, 5]}
//                             axisLine={false}
//                             tickLine={false}
//                         />

//                         <Tooltip />

//                         <Bar
//                             dataKey="mood"
//                             radius={[10, 10, 10, 10]}
//                         >

//                             {data.map((entry, index) => {
//                                 if (entry.mood === null) {

//                                     return (
//                                         <Cell
//                                             key={index}
//                                             fill="#d9d9d9"
//                                         />
//                                     )
//                                 }

//                                 if (entry.mood <= 2) {

//                                     return (
//                                         <Cell
//                                             key={index}
//                                             fill="#d95c2d"
//                                         />
//                                     )
//                                 }

//                                 if (entry.mood === 3) {

//                                     return (
//                                         <Cell
//                                             key={index}
//                                             fill="#d9a52d"
//                                         />
//                                     )
//                                 }

//                                 return (
//                                     <Cell
//                                         key={index}
//                                         fill="#26a17b"
//                                     />
//                                 )

//                             })}

//                         </Bar>

//                     </BarChart>

//                 </ResponsiveContainer>

//             </div>

//             <div className="message-box">

//                 {message || ""}

//             </div>

//         </div>
//     )
// }

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
        score: number,
        date: string,
        mood:string
    }

    type ChartData = {
        day: string,
        mood: number | null,
        color: string | null
    }

    const [data, setData] = useState<ChartData[]>([]);

    const [message, setMessage] =useState("");

    const [loading, setLoading] =useState(true);

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

    async function GenChat(text: string) {

        try {
            const res = await axios.post(
            "http://localhost:5000/api/chat/chat",

            {
                text:text
            },

            {
                withCredentials:true,

                headers:{
                   authorization:`Bearer ${localStorage.getItem("token")}`
                }
            }
            );

            console.log(res.data.message)

            if (res.data.message) {
                setMessage(res.data.message);
            }

        } catch (err) {

            console.log(err);

        }
    }

    async function fetchData() {

        try {

            const res = await axios.get(
                "http://localhost:5000/api/note/weekStat",
                {
                    headers: {
                        token:`Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const weekDays = [
                "SUN",
                "MON",
                "TUE",
                "WED",
                "THU",
                "FRI",
                "SAT"
            ];

            const fullWeek: ChartData[] =
                weekDays.map((day) => ({
                    day,
                    mood: null,
                    color: null
                }));

            res.data.forEach((item: Mood) => {

                const itemDate = new Date(item.date);
                const jsDay = itemDate.getDay();

                fullWeek[jsDay].mood = item.score;
                // COMMENT: แก้ไข Syntax Error ลบเครื่องหมายจุด (.) ที่พิมพ์เกินหลังวงเล็บเหลี่ยมออกแล้ว
                fullWeek[jsDay].color = MatchColor(item.mood)
            });

            setData(fullWeek);

            const text = fullWeek.map((item) => {

                return `
                    วัน ${item.day}
                    ${
                        item.mood === null
                            ? "ไม่มีข้อมูล"
                            : `อารมณ์ระดับ ${item.mood}`
                    }
                `;

            }).join("\n");

            const finalText =
                text +
                `
                นี่คือข้อมูลอารมณ์ของสัปดาห์นี้
                ช่วยสรุปหรือให้คำแนะนำสั้น ๆ
                ไม่เกิน 50 คำ
                ถ้าไม่มีข้อมูลให้บอกว่าไม่มีข้อมูล
                `;

            await GenChat(finalText);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {

        return (
            <div className="loading">
                Loading...
            </div>
        )
    }

    return (

        <div className="week-container">

            <div className="chart-wrapper">

                <ResponsiveContainer
                    width="100%"
                    height={320}
                >

                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 10,
                            left: 0,
                            bottom: 0
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            domain={[0, 5]}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip />

                            <Bar
                                dataKey="mood"
                                radius={[10, 10, 10, 10]}
                            >
                                {data.map((entry, index) => (

                                    <Cell
                                        key={index}
                                        fill={entry.color ?? "#F5F5F5"}
                                    />

                                ))}

                            </Bar>

                    </BarChart>

                </ResponsiveContainer>

            </div>

            <div className="message-box">

                {message || ""}

            </div>

        </div>
    )
}