// frontend/src/modules/officer/pages/OfficerDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import axios from "../../../api/axiosConfig";
import {
  EmojiEvents,
  AssignmentTurnedIn,
  HourglassBottom,
  ForwardToInbox,
  DirectionsWalk,
  ThumbUp,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

export default function OfficerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define consistent colors for each status
  const STATUS_COLORS = {
    Resolved: "#16a34a",
    "In Progress": "#3b82f6",
    Pending: "#f59e0b",
    Forwarded: "#8b5cf6",
    Rejected: "#ef4444",
    default: "#6b7280",
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: complaintsData } = await axios.get("/officer/complaints");
        const { data: visitsData } = await axios.get("/officer/visits");

        const complaints = complaintsData?.complaints || [];
        const visits = visitsData?.visits || [];

        // Complaint status counts
        const statusCount = complaints.reduce((acc, c) => {
          acc[c.status] = (acc[c.status] || 0) + 1;
          return acc;
        }, {});

        // Monthly trend chart
        const monthlyTrend = complaints.reduce((acc, c) => {
          const month = new Date(c.createdAt).toLocaleString("default", { month: "short" });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});
        const trendData = Object.entries(monthlyTrend).map(([name, value]) => ({ name, value }));

        // Department dummy data
        const deptData = [
          { name: "Water", value: 10 },
          { name: "Electricity", value: 6 },
          { name: "Road", value: 9 },
          { name: "Health", value: 5 },
          { name: "Education", value: 8 },
        ];

        // Today's visits
        const todayVisits = visits.filter(
          (v) => new Date(v.visitDate).toDateString() === new Date().toDateString()
        );

        const resolutionRate = complaints.length
          ? ((statusCount["Resolved"] || 0) / complaints.length) * 100
          : 0;

        setStats({
          total: complaints.length,
          resolved: statusCount["Resolved"] || 0,
          inProgress: statusCount["In Progress"] || 0,
          forwarded: statusCount["Forwarded"] || 0,
          rejected: statusCount["Rejected"] || 0,
          visitsToday: todayVisits.length,
          statusDistribution: Object.entries(statusCount).map(([name, value]) => ({
            name,
            value,
          })),
          trendData,
          deptData,
          visits: todayVisits,
          resolutionRate: resolutionRate.toFixed(1),
        });
      } catch (err) {
        console.error("❌ Failed to fetch officer stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#1e3a8a" }} />
      </Box>
    );

  const topCards = [
    {
      title: "Total Complaints",
      value: stats?.total,
      icon: <AssignmentTurnedIn sx={{ fontSize: 45, color: "#fff" }} />,
      bg: "linear-gradient(135deg,#2563eb,#3b82f6)",
    },
    {
      title: "Resolved",
      value: stats?.resolved,
      icon: <EmojiEvents sx={{ fontSize: 45, color: "#fff" }} />,
      bg: "linear-gradient(135deg,#16a34a,#22c55e)",
    },
    {
      title: "In Progress",
      value: stats?.inProgress,
      icon: <HourglassBottom sx={{ fontSize: 45, color: "#fff" }} />,
      bg: "linear-gradient(135deg,#3b82f6,#60a5fa)",
    },
    {
      title: "Forwarded",
      value: stats?.forwarded,
      icon: <ForwardToInbox sx={{ fontSize: 45, color: "#fff" }} />,
      bg: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
    },
    {
      title: "Visits Today",
      value: stats?.visitsToday,
      icon: <DirectionsWalk sx={{ fontSize: 45, color: "#fff" }} />,
      bg: "linear-gradient(135deg,#0ea5e9,#38bdf8)",
    },
    {
      title: "Resolution Rate",
      value: `${stats?.resolutionRate}%`,
      icon: <ThumbUp sx={{ fontSize: 45, color: "#fff" }} />,
      bg: "linear-gradient(135deg,#059669,#34d399)",
    },
  ];

  return (
    <Box className="container-fluid py-4">
      {/* ===== HEADER ===== */}
      <Box
        sx={{
          background: "linear-gradient(to right,#1e3a8a,#3b82f6)",
          borderRadius: 3,
          py: 3,
          mb: 4,
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          🧭 Officer Dashboard
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Overview of Complaints, Visits, and Performance
        </Typography>
      </Box>

      {/* ===== KPI CARDS (2 rows of 3) ===== */}
      <div className="row g-3">
        {topCards.map((card, idx) => (
          <div className="col-md-4 col-sm-6" key={idx}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring" }}>
              <Card
                sx={{
                  borderRadius: 4,
                  color: "#fff",
                  background: card.bg,
                  height: "100%",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 3,
                    py: 3,
                  }}
                >
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {card.title}
                    </Typography>
                  </Box>
                  {card.icon}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ))}
      </div>

      <Divider sx={{ my: 5 }} />

      {/* ===== CHARTS SECTION (Equal Height) ===== */}
      <div className="row g-4">
        {/* Pie Chart */}
        <div className="col-md-4 col-sm-12">
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3, height: 380 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#1e3a8a",
                mb: 2,
                textAlign: "center",
              }}
            >
              Complaint Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={290}>
              <PieChart>
                <Pie
                  data={stats.statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {stats.statusDistribution.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={STATUS_COLORS[entry.name] || STATUS_COLORS.default}
                    />
                  ))}
                </Pie>
                <RechartTooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </div>

        {/* Line Chart */}
        <div className="col-md-4 col-sm-12">
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3, height: 380 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#1e3a8a",
                mb: 2,
                textAlign: "center",
              }}
            >
              Monthly Complaint Trend
            </Typography>
            <ResponsiveContainer width="100%" height={290}>
              <LineChart data={stats.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartTooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </div>

        {/* Bar Chart */}
        <div className="col-md-4 col-sm-12">
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3, height: 380 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#1e3a8a",
                mb: 2,
                textAlign: "center",
              }}
            >
              Department Workload
            </Typography>
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={stats.deptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartTooltip />
                <Bar
                  dataKey="value"
                  fill="#22c55e"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </div>
      </div>

      <Divider sx={{ my: 5 }} />

      {/* ===== VISITS SECTION ===== */}
      <div className="row">
        <div className="col-12">
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#1e3a8a",
                mb: 3,
                textAlign: "center",
              }}
            >
              Today's Visit Overview
            </Typography>

            {stats.visits.length === 0 ? (
              <Typography textAlign="center" color="text.secondary">
                No visits recorded today.
              </Typography>
            ) : (
              <div className="row g-3">
                {stats.visits.map((v, idx) => (
                  <div className="col-md-4 col-sm-6" key={idx}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        p: 2,
                        background: "linear-gradient(135deg,#e0f2fe,#f0f9ff)",
                        boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={700}>
                        {v.location || "Unknown Area"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Officer: {v.officer?.firstName || "N/A"}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, (v.duration / 60) * 10)}
                        sx={{ mt: 2, borderRadius: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Duration: {v.duration} mins
                      </Typography>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </Paper>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <Divider sx={{ my: 5 }} />
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 2 }}
      >
        © {new Date().getFullYear()} SJD Portal — Officer Panel
      </Typography>
    </Box>
  );
}
