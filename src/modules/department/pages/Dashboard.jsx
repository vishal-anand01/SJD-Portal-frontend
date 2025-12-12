// frontend/src/modules/department/pages/DepartmentDashboard.jsx

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "../../../api/axiosConfig";

// Charts
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  LineChart,
  Line,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  Bar,
  Cell,
} from "recharts";

// COLOR PALETTE
const STATUS_COLOR = {
  Total: "#4f46e5",
  Pending: "#f97316",
  "In Progress": "#3b82f6",
  Resolved: "#22c55e",
  Rejected: "#dc2626",
  default: "#6b7280",
};

export default function DepartmentDashboard() {
  // ---- State ----
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);

  // ---- Fetch Data ----
  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, cRes] = await Promise.all([
          axios.get("/department/dashboard/stats"),
          axios.get("/department/assigned"),
        ]);

        setStats(sRes.data);
        setComplaints(cRes.data.complaints ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ---- ALWAYS RUN HOOKS (Never inside conditions) ----

  const pieData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Pending", value: stats.pending },
      { name: "In Progress", value: stats.inProgress },
      { name: "Resolved", value: stats.resolved },
      { name: "Rejected", value: stats.rejected },
    ];
  }, [stats]);

  const monthlySeries = useMemo(() => {
    if (!complaints) return [];
    const map = {};
    complaints.forEach((c) => {
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
    complaints.forEach((c) => {
      const cat = c.category || "Unspecified";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [complaints]);

  // ---- Now return loading ----
  if (loading || !stats) {
    return (
      <Box className="text-center mt-5">
        <Typography variant="h6">Loading Dashboard...</Typography>
      </Box>
    );
  }

  // ---- KPI Data ----
  const total = stats.total || 0;
  const percent = (v) => (total ? Math.round((v / total) * 100) : 0);

  const cards = [
    {
      title: "Total Complaints",
      value: stats.total,
      color: STATUS_COLOR.Total,
      bg: "#eef2ff",
      percent: 100,
      text: "All Department Complaints",
    },
    {
      title: "Pending",
      value: stats.pending,
      color: STATUS_COLOR.Pending,
      bg: "#fff7ed",
      percent: percent(stats.pending),
      text: `Pending ${percent(stats.pending)}%`,
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      color: STATUS_COLOR["In Progress"],
      bg: "#eff6ff",
      percent: percent(stats.inProgress),
      text: `In Progress ${percent(stats.inProgress)}%`,
    },
    {
      title: "Resolved",
      value: stats.resolved,
      color: STATUS_COLOR.Resolved,
      bg: "#ecfdf5",
      percent: percent(stats.resolved),
      text: `Resolved ${percent(stats.resolved)}%`,
    },
    {
      title: "Rejected",
      value: stats.rejected,
      color: STATUS_COLOR.Rejected,
      bg: "#fef2f2",
      percent: percent(stats.rejected),
      text: `Rejected ${percent(stats.rejected)}%`,
    },
  ];

  // ---- UI START ----
  return (
    <Box className="container-fluid py-4">
      {/* TITLE */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: "#4f46e5",
            mb: 3,
            textAlign: "center",
            letterSpacing: "0.5px",
          }}
        >
          🚀 Department Dashboard
        </Typography>
      </motion.div>

      {/* KPI CARDS */}
      <div className="row g-3">
        {cards.map((c, i) => (
          <div className="col-md-4 col-sm-6" key={i}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring" }}>
              <Card
                sx={{
                  borderRadius: 4,
                  bgcolor: c.bg,
                  height: "100%",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: c.color, fontWeight: 700 }}>
                    {c.title}
                  </Typography>

                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Typography variant="h4" sx={{ color: c.color, fontWeight: 900 }}>
                      {c.value}
                    </Typography>
                  </motion.div>

                  <Divider sx={{ my: 1 }} />

                  <LinearProgress
                    variant="determinate"
                    value={c.percent}
                    sx={{
                      height: 8,
                      borderRadius: 6,
                      bgcolor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": { bgcolor: c.color },
                    }}
                  />

                  <Typography variant="caption" sx={{ mt: 1, display: "block", fontWeight: 600 }}>
                    {c.text}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-3 mt-4">
        {/* PIE */}
        <div className="col-md-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card sx={{ height: 360, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={800} color="#4f46e5" textAlign="center">
                  🥧 Complaints Breakdown
                </Typography>

                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                      {pieData.map((e, i) => (
                        <Cell key={i} fill={STATUS_COLOR[e.name]} />
                      ))}
                    </Pie>
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* MONTHLY LINE */}
        <div className="col-md-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card sx={{ height: 360, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={800} color="#4f46e5" textAlign="center">
                  📈 Monthly Trend
                </Typography>

                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={monthlySeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ReTooltip />
                    <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* CATEGORY BAR */}
        <div className="col-md-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card sx={{ height: 360, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={800} color="#4f46e5" textAlign="center">
                  📊 Category-wise
                </Typography>

                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={categorySeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ReTooltip />
                    <Bar dataKey="count" barSize={35} radius={[6, 6, 0, 0]}>
                      {categorySeries.map((cat, i) => (
                        <Cell key={i} fill="#f59e0b" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="row mt-5">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ px: 3, py: 2, bgcolor: "#4f46e5", color: "#fff" }}>
              <Typography variant="h6" fontWeight={700}>
                🧾 Recent Complaints
              </Typography>
            </Box>

            <CardContent sx={{ p: 0 }}>
              <table className="table table-striped">
                <thead style={{ background: "#eef2ff" }}>
                  <tr>
                    <th>#</th>
                    <th>Tracking ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.slice(0, 5).map((c, i) => (
                    <tr key={c._id}>
                      <td>{i + 1}</td>
                      <td>{c.trackingId}</td>
                      <td>{c.title}</td>
                      <td>
                        <Chip
                          label={c.status}
                          size="small"
                          sx={{
                            bgcolor: STATUS_COLOR[c.status],
                            color: "#fff",
                            fontWeight: 700,
                          }}
                        />
                      </td>
                      <td>
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Box>
  );
}
