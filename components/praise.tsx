"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import "@/styles/Praise.css"

export default function Praise() {

    const [data, setData] = useState<string[]>([]);

    async function handleShow() {

        try {

            const res = await axios.get(
                "http://localhost:5000/api/note/praise",
                {
                    withCredentials: true,
                    headers: {
                        token: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            console.log(res.data);
            
            if (res.data) {
                setData(res.data);
            } else {
                console.log(res.data.error);
            }

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleShow();
    }, []);

    return (
        <div className="container">
            <p className="title">
                Look i'm pretty good
            </p>
            {
                data.length === 0 && (
                    <p className="empty">
                        not have any data
                    </p>
                )
            }

            <div className="praise-scroll">
            {
                data.map((item, index) => (
                    <div 
                        className="card"
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