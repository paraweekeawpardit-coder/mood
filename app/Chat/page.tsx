"use client"

import axios from "axios";
import { useState } from "react";
import Bar from "@/components/Bar";
import "./Chat.css";

export default function Chat() {

    type MessageType = {
        text: string,
        role: string
    }

    const [input, setInput] = useState("");
    const [message, setMessage] = useState<MessageType[]>([]);
    const [err, setErr] = useState("");

    async function handleSend() {

        if (!input.trim()) return;

        const userMessage: MessageType = {
            text: input,
            role: "user"
        };

        setMessage((prev) => [...prev, userMessage]);
        setInput("");

        try {
            const res = await axios.post(
                "http://localhost:5000/api/chat/chat",
                userMessage,
                {
                    headers: {
                        token: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            setMessage((prev) => [
                ...prev,
                {
                    text: res.data.message,
                    role: "chat"
                }
            ]);

        } catch (err: any) {
            setErr(err.message);
        }
    }

     return (
        <div className="chat-page">
            <div className="chat-navbar">
                <Bar />
            </div>
            <div className="chat-content">

                <div className="chat-messages">

                    {
                        err && (
                            <div className="chat-error">
                                {err}
                            </div>
                        )
                    }

                    {
                        message.map((mes, index) => (

                            <div
                                key={index}
                                className={mes.role}
                            >
                                {mes.text}
                            </div>
                        ))
                    }

                </div>

                <div className="chat-input-wrapper">
                    <input
                        type="text"
                        value={input}
                        placeholder="Type something..."
                        className="chat-input"
                        onChange={(e) =>
                            setInput(e.target.value)
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                handleSend();
                            }
                        }}
                    />
                    <button
                        onClick={handleSend}
                        className="send-button"
                    >
                        ↑
                    </button>
                </div>
            </div>
        </div>
    );
}