"use client"

import axios from "axios";
import { useState, useRef, useEffect } from "react";
import Bar from "@/components/Bar";
import "./Chat.css";

type MessageType = {
    text: string;
    role: "user" | "chat";
};

export default function Chat() {
    const [input, setInput] = useState("");
    const [message, setMessage] = useState<MessageType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState("");
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [message, isLoading]);

    async function handleSend(customText?: string) {
        const textToSend = (customText ?? input).trim();
        if (!textToSend || isLoading) return;

        const userMessage: MessageType = {
            text: textToSend,
            role: "user",
        };

        setErr("");
        setMessage((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await axios.post(
                "https://mood-98v8.onrender.com/api/chat/chat",
                userMessage,
                {
                    headers: {
                        token: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setMessage((prev) => [
                ...prev,
                {
                    text: res.data.message,
                    role: "chat",
                },
            ]);
        } catch (error: any) {
            setErr(error.response?.data?.error || error.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const quickPrompts = [
        "วันนี้รู้สึกเหนื่อยๆ ขอกำลังใจหน่อย",
        "ช่วยดูแนวโน้มอารมณ์ของฉันช่วงนี้ที",
        "มีเรื่องไม่สบายใจ อยากระบายให้ฟัง",
    ];

    return (
        <div className="chat-page">
            <div className="chat-navbar">
                <Bar />
            </div>

            <div className="chat-main">
                <div className="chat-card">
                    {/* ส่วนหัวการ์ดแชต */}
                    <div className="chat-header">
                        <div className="chat-bot-profile">
                            <div className="bot-avatar-header">✦</div>
                            <div className="bot-info">
                                <h3>Mood Buddy</h3>
                                <span className="bot-status">
                                    <span className="status-dot" />
                                    พร้อมรับฟังเสมอ
                                </span>
                            </div>
                        </div>

                        {message.length > 0 && (
                            <button
                                type="button"
                                className="clear-btn"
                                onClick={() => {
                                    setMessage([]);
                                    setErr("");
                                }}
                            >
                                ล้างแชต
                            </button>
                        )}
                    </div>

                    {/* พื้นที่ข้อความ */}
                    <div className="chat-messages">
                        {message.length === 0 && !err && (
                            <div className="chat-empty">
                                <div className="empty-mood-pills">
                                    <span className="pill-dot" style={{ background: "#b8f0c8" }} />
                                    <span className="pill-dot" style={{ background: "#fef9a0" }} />
                                    <span className="pill-dot" style={{ background: "#ffd9a0" }} />
                                    <span className="pill-dot" style={{ background: "#ffb8cc" }} />
                                    <span className="pill-dot" style={{ background: "#b8ecf7" }} />
                                    <span className="pill-dot" style={{ background: "#d4b8f7" }} />
                                </div>
                                <h2>พื้นที่ปลอดภัยสำหรับทุกความรู้สึก</h2>
                                <p>
                                    ไม่ว่าวันนี้จะเจอเรื่องดีๆ หรือเรื่องที่ทำให้เหนื่อยใจ
                                    พิมพ์เล่าให้ฟังได้เลยนะ
                                </p>

                                <div className="chat-suggestions">
                                    {quickPrompts.map((prompt) => (
                                        <button
                                            key={prompt}
                                            type="button"
                                            className="suggestion-chip"
                                            onClick={() => handleSend(prompt)}
                                        >
                                            <span>{prompt}</span>
                                            <span>→</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {message.map((mes, index) => (
                            <div
                                key={index}
                                className={`msg-row ${mes.role === "user" ? "user-row" : "chat-row"}`}
                            >
                                {mes.role === "chat" && (
                                    <div className="msg-avatar">✦</div>
                                )}
                                <div className={mes.role}>
                                    {mes.text}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="msg-row chat-row">
                                <div className="msg-avatar">✦</div>
                                <div className="typing-bubble">
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                </div>
                            </div>
                        )}

                        {err && <div className="chat-error">{err}</div>}

                        <div ref={bottomRef} />
                    </div>

                    {/* ช่องพิมพ์ข้อความ */}
                    <div className="chat-input-wrapper">
                        <div className="chat-input-box">
                            <input
                                type="text"
                                value={input}
                                placeholder="เล่าเรื่องราวของวันนี้..."
                                className="chat-input"
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSend();
                                    }
                                }}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className="send-button"
                                aria-label="Send message"
                            >
                                ↑
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}