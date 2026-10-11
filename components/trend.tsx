"use client";

import { useEffect, useState } from "react";
import { XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts";
import axios from "axios";
import "@/styles/trend.css";

type ChartData = {
  date: string; 
  score: number;
};

export default function Trend() {
  const [data, setData] = useState<ChartData[]>([]);

  async function handleShow() {
    try {
      const res = await axios.get("http://localhost:5000/api/note/moodtrend", {
        withCredentials: true,
        headers: {
          token: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data) {
        // 2. Map ข้อมูลและจัดฟอร์แมตวันที่ให้อ่านง่ายขึ้น
        const newFormatted = res.data.map((item: any) => {
          const dateObj = new Date(item.date);
          
          // แปลงเป็นฟอร์แมตสั้นๆ เช่น "17 Jun" หรือใช้ item.date.split('T')[0] เพื่อเอา "2026-06-17"
          const formattedDate = dateObj.toISOString().split('T')[0]

          return {
            date: formattedDate,
            score: item.score,
          };
        });

        setData(newFormatted);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    handleShow();
  }, []);

  return (
    <div className="trend-container">
      <h1 className="trend-title">mood trend</h1>

      {data.length === 0 ? (
        <p className="no-data">not have any data</p>
      ) : (
        /* 3. ครอบด้วย ResponsiveContainer เพื่อให้กราฟยืดหยุ่น และกำหนดความสูง */
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b4bdb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#5b4bdb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              
              {/* เปลี่ยน dataKey เป็น "date" ตัวพิมพ์เล็กให้ตรงกับข้อมูล */}
              <XAxis dataKey="date" tick={{ fontSize: 12 }} /> 
              
              <YAxis axisLine={false} tickLine={false} domain={[0, 5]} tickCount={6} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#5b4bdb"
                strokeWidth={3}
                fill="url(#scoreGradient)"
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}