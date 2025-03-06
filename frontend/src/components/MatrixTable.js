import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useLUFSData from "../hooks/useLUFSData";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const MatrixTable = ({ basePath }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = selectedDate.format("YYYYMMDD");
  const { lufsData, programData, reloadData } = useLUFSData(basePath, formattedDate);
  const [redThreshold, setRedThreshold] = useState(-21);
  const [yellowThreshold, setYellowThreshold] = useState(-26);

  const columns = [...Array(26)].map((_, i) => String.fromCharCode(65 + i));
  const rows = [...Array(99)].map((_, i) => i + 1);

  const getCellStyle = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return {};
    if (numValue <= -60) return { backgroundColor: "gray", color: "white" };
    if (numValue >= redThreshold) return { backgroundColor: "red", color: "white" };
    if (numValue <= yellowThreshold) return { backgroundColor: "yellow", color: "black" };
    return {};
  };

  const getCellValue = (row, col) => {
    const combinedData = {};
    for (const index in programData) {
      if (lufsData.hasOwnProperty(index)) {
        programData[index].forEach((program) => {
          combinedData[program] = lufsData[index];
        });
      }
    }
    const key = `${col}${row.toString().padStart(2, "0")}`;
    return combinedData[key];
  };
  
  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <div style={{ marginBottom: "10px", marginTop: "30px" }}>
        <DatePicker
          label="日付選択"
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="赤の閾値"
          type="number"
          value={redThreshold}
          onChange={(e) => setRedThreshold(parseFloat(e.target.value) || -21)}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="黄色の閾値"
          type="number"
          value={yellowThreshold}
          onChange={(e) => setYellowThreshold(parseFloat(e.target.value) || -26)}
        />
      </div>
      <TableContainer component={Paper} sx={{ maxWidth: "80%", margin: "auto", mt: 2, maxHeight: "750px", overflow: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center", position: "sticky", left: 0, backgroundColor: "#fff", zIndex: 2 }}>
                #
              </TableCell>
              {columns.map((col) => (
                <TableCell key={col} sx={{ fontWeight: "bold", textAlign: "center", position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 1 }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row}>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", position: "sticky", left: 0, backgroundColor: "#f5f5f5", zIndex: 1 }}>
                  {row}
                </TableCell>
                {columns.map((col) => {
                  const value = getCellValue(row, col);
                  const channel = `${col}${row.toString().padStart(2, '0')}`;
                  return (
                    <TableCell key={`${col}${row}`} sx={{ textAlign: "center", padding: "8px", ...getCellStyle(value) }}>
                    {value ? (
                      <Link to={`/${channel}`} style={{ textDecoration: "none", color: "inherit" }}>
                        {value}
                      </Link>
                    ) : (
                      value
                    )}
                  </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MatrixTable;