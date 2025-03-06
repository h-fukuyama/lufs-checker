import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const LufsChart = ({ data }) => {
    const [yMin, setYMin] = useState(-70);
    const [yMax, setYMax] = useState(-16);
    return (
        <div style={{ margin: "20px", fontFamily: "Arial, sans-serif" }}>
            <div style={{ marginBottom: "20px" }}>
                {/* Y軸の範囲設定 */}
                <label style={{ fontWeight: "bold", marginRight: "10px" }}>Y最小値:</label>
                <input
                    type="number"
                    value={yMin}
                    onChange={(e) => setYMin(Number(e.target.value))}
                    style={{
                        padding: "8px",
                        fontSize: "14px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        width: "80px",
                        marginRight: "20px",
                    }}
                />
                <label style={{ fontWeight: "bold", marginRight: "10px" }}>Y最大値:</label>
                <input
                    type="number"
                    value={yMax}
                    onChange={(e) => setYMax(Number(e.target.value))}
                    style={{
                        padding: "8px",
                        fontSize: "14px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        width: "80px",
                    }}
                />
            </div>
    
            <ResponsiveContainer width="90%" height={450}>
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    style={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        padding: "15px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis domain={[yMin, yMax]} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="lufs"
                        stroke="#007bff"
                        strokeWidth={2.5}
                        dot={{ fill: "#007bff", r: 1 }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
    
};

export default LufsChart;
