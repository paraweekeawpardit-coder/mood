"use client"
import { useEffect, useState } from "react";
import axios , { AxiosError } from "axios";
import "@/styles/note.css"

type Props = {
    date: Date
}

type MoodData = {
    date: Date,
    mood: string,
    description: string,
    praise: string,
    learn: string,
}

export default function Note({ date }: Props) {

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
            console.log("handleShow work");
            setMessage("");
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            console.log("get note of date :",formattedDate);

            const res = await axios.get(
                "http://localhost:5000/api/note/moodmemo",  
                {
                    withCredentials: true,
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    params: {
                        date: formattedDate 
                    }
                }
            );
            
            console.log("after req");
            console.log(res.data.note);

            if (res.data.note) {
                console.log(res.data.note);
                setData({
                    date: res.data.note.date,
                    mood: res.data.note.mood || "",
                    description: res.data.note.describe || "",
                    praise: res.data.note.praise || "",
                    learn: res.data.note.learn || "",
                });
                setHasSavedData(true);
            } else {
                console.log("can't find")
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
            console.log(err);
        }
    }

    useEffect(() => {
        console.log("effect work");
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
        console.log(data);
        console.log("handleSubmit work");
        
        const res = await axios.post(
            "http://localhost:5000/api/note/moodtracker",
            data,
            {
                withCredentials: true,
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        
        console.log("after req submit");
        console.log("data sent",data)
        console.log("data get",res.data.note);


        if (res.data.error) {
            setMessage(res.data.error);
        } else {
            setMessage("save success");


        const rawData = localStorage.getItem("user-Storage") || "{}";
        const parsedData = JSON.parse(rawData);

        let count = parsedData.count || 0;
        const lastuseDateStr = parsedData.date; // ดึงวันล่าสุดมาเช็ก (คีย์ 'date' ตัวเล็ก)

        // สร้าง Object วันนี้และล้างเวลา (ชั่วโมง,นาที,วิ) ให้เป็น 0 ทั้งหมดเพื่อเปรียบเทียบแค่วันที่
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let storageData = { count: 1, date: today };

        if (lastuseDateStr) {
            const lastuse = new Date(lastuseDateStr);
            lastuse.setHours(0, 0, 0, 0);

            const diffTime = today.getTime() - lastuse.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                storageData = { count: count, date: today };
            } else if (diffDays === 1) {
                storageData = { count: count + 1, date: today };
            } else {
                storageData = { count: 1, date: today };
            }
        } else {
            storageData = { count: 1, date: today };
        }

        localStorage.setItem("user-Storage", JSON.stringify(storageData));
        // announment finish
        window.dispatchEvent(new Event("streakUpdated"));

            setHasSavedData(true);
            setData({
                date: date,
                mood: "",
                description: "",
                praise: "",
                learn: ""
            });
        }

        handleShow();

    } catch (err) {
        console.error("Submit error:", err);
        const error = err as AxiosError<any>;

            if (error.response?.data?.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage("something went wrong, please try again");
            }
    }
}

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    return (
        <div className="note-container">

            {hasSavedData && (
                <p className="saved-msg">
                    you already saved your mood today
                </p>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); console.log("submit")}}>
                <fieldset disabled={hasSavedData && (date < new Date() )}>
                <div className="mood-section">

                    <span className="note-date">
                        {date.getDate().toString().padStart(2, '0')}
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
                    <input
                        type="text"
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                        disabled={hasSavedData}
                        className="note-textarea"
                    />
                </div>

                <div className="input-group">
                    <label>something you're proud of today</label>
                    <input
                        type="text"
                        name="praise"
                        value={data.praise}
                        onChange={handleChange}
                        disabled={hasSavedData}
                        className="note-textarea"
                    />
                </div>

                <div className="input-group">
                    <label>what's thing you learn from today?</label>
                    <input
                        type="text"
                        name="learn"
                        value={data.learn}
                        onChange={handleChange}
                        disabled={hasSavedData}
                        className="note-textarea"
                    />
                </div>

                <button type="submit" className="submit-btn">
                    submit
                </button>
                </fieldset>
            </form>

            <p className="msg">{message}</p>

        </div>
    );
}

