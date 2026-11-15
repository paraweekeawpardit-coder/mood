"use client"
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import "@/styles/note.css";

type Props = {
    date: Date;
    onSaved?: () => void;
};

type MoodData = {
    date: Date | string;
    mood: string;
    description: string;
    praise: string;
    learn: string;
};

export default function Note({ date, onSaved }: Props) {
    const [hasSavedData, setHasSavedData] = useState(false);
    const [message, setMessage] = useState("");
    const [data, setData] = useState<MoodData>({
        date: date,
        mood: "",
        description: "",
        praise: "",
        learn: ""
    });

    async function handleShow() {
        try {
            setMessage("");

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day}`;

            const token = localStorage.getItem("token");
            const res = await axios.get(
                "http://localhost:5000/api/note/moodmemo",
                {
                    withCredentials: true,
                    headers: {
                        authorization: `Bearer ${token}`,
                        token: `Bearer ${token}`
                    },
                    params: {
                        date: formattedDate
                    }
                }
            );

            if (res.data.note) {
                setData({
                    date: res.data.note.date,
                    mood: res.data.note.mood || "",
                    description: res.data.note.describe === "not have" ? "" : (res.data.note.describe || ""),
                    praise: res.data.note.praise === "not have" ? "" : (res.data.note.praise || ""),
                    learn: res.data.note.learn === "not have" ? "" : (res.data.note.learn || ""),
                });
                setHasSavedData(true);
            } else {
                setHasSavedData(false);
                setData({
                    date: date,
                    mood: "",
                    description: "",
                    praise: "",
                    learn: ""
                });
            }
        } catch (err) {
            console.log("Get note error:", err);
        }
    }

    useEffect(() => {
        setHasSavedData(false);
        setData({
            date: date,
            mood: "",
            description: "",
            praise: "",
            learn: ""
        });
        handleShow();
    }, [date]);

    async function handleSubmit() {
        try {
            setMessage("");

            if (!data.mood) {
                setMessage("please select mood");
                return;
            }

            // ส่งวันที่เป็น YYYY-MM-DD ตามเวลาเครื่องผู้ใช้ เพื่อไม่ให้เพี้ยนเป็น UTC
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const localDateStr = `${year}-${month}-${day}`;

            const payload = {
                ...data,
                date: localDateStr,
            };

            const token = localStorage.getItem("token");
            const res = await axios.post(
                "http://localhost:5000/api/note/moodtracker",
                payload,
                {
                    withCredentials: true,
                    headers: {
                        authorization: `Bearer ${token}`,
                        token: `Bearer ${token}`
                    }
                }
            );

            if (res.data.error) {
                setMessage(res.data.error);
                return;
            }
            if (res.data.message && res.data.message !== "successed!!") {
                setMessage(res.data.message);
                return;
            }

            setMessage("save success");

            // อัปเดต Streak
            const rawData = localStorage.getItem("user-Storage") || "{}";
            const parsedData = JSON.parse(rawData);
            let count = parsedData.count || 0;
            const lastuseDateStr = parsedData.date;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let storageData = { count: 1, date: today };

            if (lastuseDateStr) {
                const lastuse = new Date(lastuseDateStr);
                lastuse.setHours(0, 0, 0, 0);
                const diffDays = Math.floor((today.getTime() - lastuse.getTime()) / (1000 * 60 * 60 * 24));

                if (diffDays === 0) {
                    storageData = { count: count, date: today };
                } else if (diffDays === 1) {
                    storageData = { count: count + 1, date: today };
                } else {
                    storageData = { count: 1, date: today };
                }
            }

            localStorage.setItem("user-Storage", JSON.stringify(storageData));
            window.dispatchEvent(new Event("streakUpdated"));

            setHasSavedData(true);
            if (onSaved) onSaved();
            handleShow();

        } catch (err) {
            console.log("Submit error:", err);
            const error = err as AxiosError<any>;
            if (error.response?.data?.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage("something went wrong, please try again");
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const moods = [
        { value: "very good", id: "verygood",  className: "verygood",  label: "very good" },
        { value: "great",     id: "great",     className: "great",     label: "great"     },
        { value: "meh",       id: "meh",       className: "meh",       label: "meh"       },
        { value: "mad",       id: "mad",       className: "mad",       label: "mad"       },
        { value: "sad",       id: "sad",       className: "sad",       label: "sad"       },
        { value: "anxious",   id: "anxious",   className: "anxious",   label: "anxious"   },
    ];

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const selectedStart = new Date(date);
    selectedStart.setHours(0, 0, 0, 0);
    const isPastDay = selectedStart < todayStart;

    return (
        <div className="note-container">
            {hasSavedData && (
                <p className="saved-msg">
                    you already saved your mood this day
                </p>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <fieldset disabled={hasSavedData || isPastDay} style={{ border: "none", padding: 0, margin: 0 }}>
                    <div className="mood-section">
                        <span className="note-date">
                            {date.getDate().toString().padStart(2, "0")}
                        </span>

                        <span className="note-title">how your mood today ?</span>

                        <div className="mood-group">
                            {moods.map((mood) => (
                                <span className="radio" key={mood.id}>
                                    <input
                                        type="radio"
                                        name="mood"
                                        value={mood.value}
                                        checked={data.mood === mood.value}
                                        onChange={handleChange}
                                        id={mood.id}
                                    />
                                    <label
                                        htmlFor={mood.id}
                                        className={`mood-label ${mood.className}`}
                                    />
                                    <span className="mood-text">{mood.label}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>describe your day</label>
                        <textarea
                            rows={3}
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            className="note-textarea"
                        />
                    </div>

                    <div className="input-group">
                        <label>something you're proud of today</label>
                        <textarea
                            rows={2}
                            name="praise"
                            value={data.praise}
                            onChange={handleChange}
                            className="note-textarea"
                        />
                    </div>

                    <div className="input-group">
                        <label>what's thing you learn from today?</label>
                        <textarea
                            rows={2}
                            name="learn"
                            value={data.learn}
                            onChange={handleChange}
                            className="note-textarea"
                        />
                    </div>

                    {!hasSavedData && !isPastDay && (
                        <button type="submit" className="submit-btn">
                            submit
                        </button>
                    )}
                </fieldset>
            </form>

            {message && <p className="msg">{message}</p>}
        </div>
    );
}