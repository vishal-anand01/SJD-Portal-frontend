import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  LinearProgress,
  Divider,
  Stack,
  Chip,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../../../api/axiosConfig";
import ToastAlert from "../../../components/notifications/ToastAlert";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const PALETTE = {
  primary: "#1e3a8a",
  accent: "#06b6d4",
  warm: "#f59e0b",
  success: "#10b981",
  soft: "#eef2ff",
};

export default function SuperAdminDashboard() {
  const theme = useTheme();
  const [counts, setCounts] = useState({
    dms: 0,
    departments: 0,
    officers: 0,
    publics: 0,
    complaints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // try an aggregated endpoint first, fallback to individual
        const [d, dep, o, p, comp] = await Promise.allSettled([
          axios.get("/admin/counts/dms"),
          axios.get("/admin/counts/departments"),
          axios.get("/admin/counts/officers"),
          axios.get("/admin/counts/publics"),
          axios.get("/admin/counts/complaints"),
        ]);

        setCounts({
          dms: d.status === "fulfilled" ? d.value.data.count : 0,
          departments: dep.status === "fulfilled" ? dep.value.data.count : 0,
          officers: o.status === "fulfilled" ? o.value.data.count : 0,
          publics: p.status === "fulfilled" ? p.value.data.count : 0,
          complaints:
            comp.status === "fulfilled" ? comp.value.data.count : 0,
        });
      } catch (err) {
        if (ToastAlert?.error) ToastAlert.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalEntities = useMemo(() => {
    return (
      counts.dms + counts.departments + counts.officers + counts.publics || 1
    );
  }, [counts]);

  const cards = [
    {
      title: "DMs",
      key: "dms",
      value: counts.dms,
      color: PALETTE.primary,
      bg: "linear-gradient(90deg,#eef2ff,#e0f2fe)",
      path: "/superadmin/dm/list",
    },
    {
      title: "Departments",
      key: "departments",
      value: counts.departments,
      color: PALETTE.accent,
      bg: "linear-gradient(90deg,#ecfeff,#f0f9ff)",
      path: "/superadmin/department/list",
    },
    {
      title: "Officers",
      key: "officers",
      value: counts.officers,
      color: PALETTE.warm,
      bg: "linear-gradient(90deg,#fff7ed,#fffbeb)",
      path: "/superadmin/officer/list",
    },
    {
      title: "Public Users",
      key: "publics",
      value: counts.publics,
      color: PALETTE.success,
      bg: "linear-gradient(90deg,#ecfdf5,#f0fdf4)",
      path: "/superadmin/public/list",
    },
    {
      title: "Complaints",
      key: "complaints",
      value: counts.complaints,
      color: PALETTE.primary,
      bg: "linear-gradient(90deg,#f1f5f9,#eef2ff)",
      path: "/superadmin/complaints",
    },
  ];

  const pieData = [
    { name: "DMs", value: counts.dms },
    { name: "Departments", value: counts.departments },
    { name: "Officers", value: counts.officers },
    { name: "Publics", value: counts.publics },
  ];

  const COLORS = [PALETTE.primary, PALETTE.accent, PALETTE.warm, PALETTE.success];

  return (
    <Box className="container-fluid py-4">
      <Card
        component={motion.div}
        whileHover={{ y: -3 }}
        sx={{
          borderRadius: 3,
          mb: 3,
          overflow: "hidden",
          background: "linear-gradient(90deg,#fff,#f8fafc)",
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
            <div>
              <Typography variant="h4" sx={{ fontWeight: 900, color: PALETTE.primary }}>
                👑 SuperAdmin Dashboard
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 720 }}>
                Premium overview — quick actions and visual insights to manage DMs, Departments, Officers and Public Users.
              </Typography>
            </div>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                component={Link}
                to="/superadmin/dm/add"
                variant="contained"
                sx={{ bgcolor: PALETTE.primary }}
              >
                Add DM
              </Button>
              <Button
                component={Link}
                to="/superadmin/department/add"
                variant="outlined"
                sx={{ borderColor: PALETTE.primary, color: PALETTE.primary }}
              >
                Add Department
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <div className="row g-3">
        {cards.map((c) => (
          <div className="col-lg-4 col-md-6 col-sm-12" key={c.key}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card sx={{ borderRadius: 3, height: "100%", boxShadow: "0 6px 20px rgba(16,24,40,0.06)" }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    <div>
                      <Typography variant="subtitle2" sx={{ color: c.color, fontWeight: 800 }}>
                        {c.title}
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 900, mt: 1 }}>
                        {c.value}
                      </Typography>
                    </div>
                    <div style={{ minWidth: 120, textAlign: "right" }}>
                      <Chip label={c.title} sx={{ bgcolor: c.color, color: "#fff", fontWeight: 700 }} />
                    </div>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, Math.round((c.value / totalEntities) * 100))}
                    sx={{ height: 10, borderRadius: 6, bgcolor: "#eef2ff", "& .MuiLinearProgress-bar": { bgcolor: c.color } }}
                  />

                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Button component={Link} to={c.path} variant="contained" sx={{ bgcolor: c.color }}>
                      Open
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center" }}>
                      Updated: {new Date().toLocaleDateString("en-IN")}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="row g-3 mt-4">
        <div className="col-lg-6 col-md-12">
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} color={PALETTE.primary} textAlign="center">
                🧭 Entity Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={6}>
                    {pieData.map((entry, idx) => (
                      <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="col-lg-6 col-md-12">
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} color={PALETTE.primary} textAlign="center">
                📊 Quick Counts
              </Typography>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={pieData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} SJD Portal — SuperAdmin Panel
        </Typography>
      </Box>
    </Box>
  );
}
