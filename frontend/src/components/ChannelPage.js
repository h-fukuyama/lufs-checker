import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useChannelLUFSData from "../hooks/useChannelLUFSData";
import LufsChart from "./LufsChart";

const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10).replace(/-/g, "");
};
const getTodayTime = () => {
    const today = new Date();
    const minutes = String(today.getHours()).padStart(2, "0"); // Ensure two digits
    const seconds = String(today.getMinutes()).padStart(2, "0"); // Ensure two digits
    console.log(`${minutes}${seconds}`);
    return `${minutes}${seconds}`;
};

const ChannelPage = ({ basePath }) => {
    const { channel } = useParams();
    const [startDate, setStartDate] = useState(getTodayDate());
    console.log(startDate);
    const [startTime, setStartTime] = useState("0000");
    const [endDate, setEndDate] = useState(getTodayDate());
    const [endTime, setEndTime] = useState(getTodayTime());
    const { lufsData, serviceName } = useChannelLUFSData(basePath, channel, startDate, startTime, endDate, endTime);
    console.dir(lufsData, { depth: null });

    return (
        <div style={{ margin: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ fontSize: "24px", color: "#333" }}>
                Channel: <span style={{ color: "#007bff" }}>{channel}</span> 
                <span style={{ color: "#6c757d" }}>({serviceName})</span>
            </h1>
    
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                <label>
                    <span style={{ fontWeight: "bold" }}>開始日:</span>
                    <input
                        type="date"
                        value={`${startDate.slice(0, 4)}-${startDate.slice(4, 6)}-${startDate.slice(6, 8)}`} // YYYY-MM-DD形式に変換
                        onChange={(e) => setStartDate(e.target.value.replace(/-/g, ""))}
                        style={{ padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                </label>
                <label>
                    <span style={{ fontWeight: "bold" }}>開始時間:</span>
                    <input
                        type="time"
                        value={`${startTime.slice(0, 2)}:${startTime.slice(2, 4)}`} // HH:MM形式
                        onChange={(e) => setStartTime(e.target.value.replace(/:/g, ""))}
                        style={{ padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                </label>
            </div>
    
            <div style={{ display: "flex", gap: "15px", alignItems: "center", marginTop: "15px" }}>
                <label>
                    <span style={{ fontWeight: "bold" }}>終了日:</span>
                    <input
                        type="date"
                        value={`${endDate.slice(0, 4)}-${endDate.slice(4, 6)}-${endDate.slice(6, 8)}`} // YYYY-MM-DD形式に変換
                        onChange={(e) => setEndDate(e.target.value.replace(/-/g, ""))}
                        style={{ padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                </label>
                <label>
                    <span style={{ fontWeight: "bold" }}>終了時間:</span>
                    <input
                        type="time"
                        value={`${endTime.slice(0, 2)}:${endTime.slice(2, 4)}`} // HH:MM形式
                        onChange={(e) => setEndTime(e.target.value.replace(/:/g, ""))}
                        style={{ padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                </label>
            </div>
    
            <h2 style={{ fontSize: "20px", marginTop: "30px", color: "#333" }}>LUFS値グラフ</h2>
            <LufsChart data={lufsData} />
        </div>
    );
    
};

export default ChannelPage;