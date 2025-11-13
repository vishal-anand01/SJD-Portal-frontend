import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "../../../api/axiosConfig";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch dashboard data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/complaints");
        const complaints = data?.complaints || [];

        const total = complaints.length;
        const resolved = complaints.filter((c) => c.status === "Resolved").length;
        const pending = complaints.filter((c) => c.status === "Pending").length;
        const inProgress = complaints.filter((c) => c.status === "In Progress").length;
        const rejected = complaints.filter((c) => c.status === "Rejected").length;

        setStats({ total, resolved, pending, inProgress, rejected });
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <CircularProgress sx={{ color: "#1e3a8a" }} />
        <Typography sx={{ mt: 2, color: "#1e3a8a" }}>
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  // 🧮 Pie Chart Data
  const pieData = {
    labels: ["Resolved", "In Progress", "Pending", "Rejected"],
    datasets: [
      {
        data: [
          stats.resolved,
          stats.inProgress,
          stats.pending,
          stats.rejected,
        ],
        backgroundColor: ["#22c55e", "#3b82f6", "#facc15", "#ef4444"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // 📊 Bar Chart Data
  const barData = {
    labels: ["Resolved", "In Progress", "Pending", "Rejected"],
    datasets: [
      {
        label: "Complaints Status",
        data: [
          stats.resolved,
          stats.inProgress,
          stats.pending,
          stats.rejected,
        ],
        backgroundColor: [
          "rgba(34,197,94,0.8)",
          "rgba(59,130,246,0.8)",
          "rgba(250,204,21,0.8)",
          "rgba(239,68,68,0.8)",
        ],
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  const statCards = [
    {
      title: "Total Complaints",
      value: stats.total,
      icon: <AssignmentIcon sx={{ fontSize: 36, color: "#1e3a8a" }} />,
      color: "#1e3a8a",
      gradient: "linear-gradient(135deg, #93c5fd, #3b82f6)",
    },
    {
      title: "Resolved Complaints",
      value: stats.resolved,
      icon: <CheckCircleIcon sx={{ fontSize: 36, color: "#22c55e" }} />,
      color: "#22c55e",
      gradient: "linear-gradient(135deg, #bbf7d0, #22c55e)",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: <HourglassBottomIcon sx={{ fontSize: 36, color: "#3b82f6" }} />,
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #bfdbfe, #2563eb)",
    },
    {
      title: "Pending / Rejected",
      value: stats.pending + stats.rejected,
      icon: <CancelIcon sx={{ fontSize: 36, color: "#f87171" }} />,
      color: "#f87171",
      gradient: "linear-gradient(135deg, #fecaca, #ef4444)",
    },
  ];

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#1e3a8a", mb: 0.5 }}
          >
            Welcome Back 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here’s an overview of your complaint statistics and activity.
          </Typography>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row>
        {statCards.map((stat, idx) => (
          <Col key={idx} md={3} sm={6} xs={12} className="mb-4">
            <Card
              sx={{
                borderRadius: "16px",
                background: stat.gradient,
                color: "white",
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-6px)" },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 3,
                  py: 2,
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {stat.value}
                  </Typography>
                  <Typography>{stat.title}</Typography>
                </Box>
                {stat.icon}
              </CardContent>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Graph Section */}
      <Row className="mt-5">
        <Col md={6} xs={12} className="mb-4">
          <Card sx={{ borderRadius: 3, p: 2, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, color: "#1e3a8a", textAlign: "center" }}
            >
              Complaint Distribution (Pie)
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={pieData} />
            </Box>
          </Card>
        </Col>

        <Col md={6} xs={12} className="mb-4">
          <Card sx={{ borderRadius: 3, p: 2, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, color: "#1e3a8a", textAlign: "center" }}
            >
              Complaint Progress (Bar)
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={barData} options={barOptions} />
            </Box>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
