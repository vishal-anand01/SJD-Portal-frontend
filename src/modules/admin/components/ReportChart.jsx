// Path: frontend/src/modules/admin/components/ReportChart.jsx
import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "May", complaints: 80 },
  { month: "Jun", complaints: 120 },
  { month: "Jul", complaints: 150 },
  { month: "Aug", complaints: 130 },
  { month: "Sep", complaints: 190 },
  { month: "Oct", complaints: 210 },
];

const ReportChart = () => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="complaints" stroke="#2e6df6" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ReportChart;
    