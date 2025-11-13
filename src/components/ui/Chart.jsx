// Path: frontend/src/components/ui/Chart.jsx
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ data = [] }) => {
  // fallback demo data
  const chartData =
    data.length > 0
      ? data
      : [
          { name: "Jan", value: 30 },
          { name: "Feb", value: 45 },
          { name: "Mar", value: 60 },
          { name: "Apr", value: 50 },
          { name: "May", value: 80 },
          { name: "Jun", value: 90 },
        ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2e6df6"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
