// frontend/src/modules/dm/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "../../../api/axiosConfig";
import ToastAlert from "../../../components/notifications/ToastAlert";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const STATUS_COLOR = {
  Total: "#1e3a8a",
  Resolved: "#10b981",
  "In Progress": "#3b82f6",
  Forwarded: "#f59e0b",
  Pending: "#f97316",
  Rejected: "#ef4444",
  default: "#6b7280",
};

export default function DMDashboard() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [sRes, cRes] = await Promise.all([
          axios.get("/dm/dashboard-stats"),
          axios.get("/dm/complaints"),
        ]);
        setStats(sRes.data?.data ?? sRes.data ?? {});
        setComplaints(cRes.data?.complaints ?? []);
      } catch (err) {
        if (ToastAlert?.error) ToastAlert.error("Failed to load DM dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const statusCounts = useMemo(() => {
    const map = {};
    if (Array.isArray(stats?.byStatus)) stats.byStatus.forEach((s) => (map[s._id] = s.count));
    map.Total = stats.totalComplaints || 0;
    map.Resolved = map.Resolved || stats.resolved || 0;
    map["In Progress"] = map["In Progress"] || stats.inProgress || 0;
    map.Forwarded = map.Forwarded || stats.forwarded || 0;
    map.Pending = map.Pending || stats.pending || 0;
    map.Rejected = map.Rejected || stats.rejected || 0;
    return map;
  }, [stats]);

  const total = statusCounts.Total || 0;
  const getPercent = (count) => (total ? Math.round((count / total) * 100) : 0);

  const cards = [
    {
      title: "Total Complaints",
      key: "Total",
      color: STATUS_COLOR.Total,
      bg: "#eef2ff",
      value: statusCounts.Total,
      percent: 100,
      text: "All Registered Complaints",
    },
    {
      title: "Resolved",
      key: "Resolved",
      color: STATUS_COLOR.Resolved,
      bg: "#ecfdf5",
      value: statusCounts.Resolved,
      percent: getPercent(statusCounts.Resolved),
      text: `Resolved ${getPercent(statusCounts.Resolved)}%`,
    },
    {
      title: "In Progress",
      key: "In Progress",
      color: STATUS_COLOR["In Progress"],
      bg: "#eff6ff",
      value: statusCounts["In Progress"],
      percent: getPercent(statusCounts["In Progress"]),
      text: `In Progress ${getPercent(statusCounts["In Progress"])}%`,
    },
    {
      title: "Forwarded",
      key: "Forwarded",
      color: STATUS_COLOR.Forwarded,
      bg: "#fff7ed",
      value: statusCounts.Forwarded,
      percent: getPercent(statusCounts.Forwarded),
      text: `Forwarded ${getPercent(statusCounts.Forwarded)}%`,
    },
    {
      title: "Pending",
      key: "Pending",
      color: STATUS_COLOR.Pending,
      bg: "#fefce8",
      value: statusCounts.Pending,
      percent: getPercent(statusCounts.Pending),
      text: `Pending ${getPercent(statusCounts.Pending)}%`,
    },
    {
      title: "Rejected",
      key: "Rejected",
      color: STATUS_COLOR.Rejected,
      bg: "#fef2f2",
      value: statusCounts.Rejected,
      percent: getPercent(statusCounts.Rejected),
      text: `Rejected ${getPercent(statusCounts.Rejected)}%`,
    },
  ];

  const pieData = Object.entries(statusCounts)
    .filter(([k]) => k !== "Total")
    .map(([name, value]) => ({ name, value }));

  const monthlySeries = useMemo(() => {
    const map = {};
    (complaints || []).forEach((c) => {
      const d = new Date(c.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.keys(map)
      .sort()
      .map((k) => ({ name: k, count: map[k] }));
  }, [complaints]);

  const categorySeries = useMemo(() => {
    const map = {};
    (complaints || []).forEach((c) => {
      const cat = c.category || "Unspecified";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [complaints]);


  return (
    <Box className="container-fluid py-4">
      <Typography
        variant="h4"
        sx={{
          fontWeight: 900,
          color: "#1e3a8a",
          mb: 3,
          textAlign: "center",
        }}
      >
        🏛️ District Magistrate Dashboard
      </Typography>

      {/* ===== KPI CARDS (Bootstrap rows) ===== */}
      <div className="row g-3">
        {cards.map((c, i) => (
          <div className="col-md-4 col-sm-6" key={i}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  bgcolor: c.bg,
                  height: "100%",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: c.color,
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    {c.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color: c.color,
                      fontWeight: 900,
                    }}
                  >
                    {c.value ?? 0}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <LinearProgress
                    variant="determinate"
                    value={c.percent}
                    sx={{
                      height: 8,
                      borderRadius: 6,
                      bgcolor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: c.color,
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      mt: 1,
                      fontWeight: 600,
                    }}
                  >
                    {c.text}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ))}
      </div>

      {/* ===== 3 CHARTS ===== */}
      <div className="row g-3 mt-4">
        {/* Pie */}
        <div className="col-md-4 col-sm-12">
          <Card sx={{ borderRadius: 3, boxShadow: "0 3px 10px rgba(0,0,0,0.1)", height: 360 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} color="#1e3a8a" textAlign="center">
                🥧 Complaint Status Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={STATUS_COLOR[entry.name] || STATUS_COLOR.default} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Line */}
        <div className="col-md-4 col-sm-12">
          <Card sx={{ borderRadius: 3, boxShadow: "0 3px 10px rgba(0,0,0,0.1)", height: 360 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} color="#1e3a8a" textAlign="center">
                📈 Monthly Complaints Trend
              </Typography>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthlySeries.length ? monthlySeries : [{ name: "No data", count: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="count" stroke="#1e3a8a" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bar */}
        <div className="col-md-4 col-sm-12">
          <Card sx={{ borderRadius: 3, boxShadow: "0 3px 10px rgba(0,0,0,0.1)", height: 360 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} color="#1e3a8a" textAlign="center">
                📊 Category-Wise Complaints
              </Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categorySeries.length ? categorySeries : [{ name: "No data", count: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ===== Recent Complaints ===== */}
      <div className="row mt-5">
        <div className="col-12">
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 15px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <Box
              sx={{
                px: 3,
                py: 2,
                bgcolor: "#1e3a8a",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                🧾 Recent Complaints
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Showing last {Math.min(5, complaints.length)} entries
              </Typography>
            </Box>

            <CardContent sx={{ p: 0 }}>
              <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                <Table size="small">
                  <TableHead sx={{ background: "linear-gradient(to right, #eff6ff, #e0e7ff)" }}>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Tracking ID</TableCell>
                      <TableCell>Citizen</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {complaints.length ? (
                      complaints.slice(0, 5).map((c, index) => (
                        <TableRow key={c._id} hover sx={{ "&:hover": { bgcolor: "#f1f5f9" } }}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#1e3a8a" }}>
                            {c.trackingId || "N/A"}
                          </TableCell>
                          <TableCell>
                            {c.citizenName ||
                              `${c.citizen?.firstName || ""} ${c.citizen?.lastName || ""}` ||
                              "N/A"}
                          </TableCell>
                          <TableCell>{c.title || "N/A"}</TableCell>
                          <TableCell>{c.category || "N/A"}</TableCell>
                          <TableCell>
                            <Chip
                              label={c.status}
                              size="small"
                              sx={{
                                bgcolor:
                                  STATUS_COLOR[c.status] || STATUS_COLOR.default,
                                color: "#fff",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(c.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No recent complaints found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>

            <Box
              sx={{
                textAlign: "right",
                px: 3,
                py: 1.5,
                borderTop: "1px solid #e2e8f0",
                bgcolor: "#f8fafc",
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500 }}>
                Updated on{" "}
                {new Date().toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          </Card>
        </div>
      </div>

      <Divider sx={{ my: 4 }} />
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} SJD Portal — District Magistrate Panel
      </Typography>
    </Box>
  );
}
