import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  ReportProblem,
  Timeline,
  Security,
  Groups,
  NotificationsActive,
  SyncAlt,
} from "@mui/icons-material";
import heroImg from "../../../assets/images/HeroSectionImage.jpg";

export default function Home() {
  const features = [
    {
      icon: <ReportProblem color="error" sx={{ fontSize: 48 }} />,
      title: "Easy Complaint Filing",
      text: "Register complaints in just a few clicks from any device — anytime, anywhere.",
    },
    {
      icon: <Timeline color="primary" sx={{ fontSize: 48 }} />,
      title: "Real-Time Tracking",
      text: "Stay informed with live status updates from the concerned department.",
    },
    {
      icon: <Security color="success" sx={{ fontSize: 48 }} />,
      title: "Secure Platform",
      text: "Data privacy ensured with end-to-end encryption and secure verification.",
    },
    {
      icon: <SyncAlt color="warning" sx={{ fontSize: 48 }} />,
      title: "Smart Transfers",
      text: "Complaints automatically routed to the correct department for faster resolution.",
    },
    {
      icon: <NotificationsActive color="secondary" sx={{ fontSize: 48 }} />,
      title: "Instant Alerts",
      text: "Receive instant SMS and Email notifications about your complaint status.",
    },
    {
      icon: <Groups color="info" sx={{ fontSize: 48 }} />,
      title: "Multi-Department Coordination",
      text: "Collaborative handling across 12+ departments under one unified system.",
    },
  ];

  const departments = [
    { name: "Health & Sanitation", color: "#ef4444" },
    { name: "Roads & Transport", color: "#2563eb" },
    { name: "Water Supply", color: "#0ea5e9" },
    { name: "Electricity", color: "#eab308" },
    { name: "Education", color: "#8b5cf6" },
    { name: "Police & Security", color: "#059669" },
  ];

  const complaints = [
    {
      id: "JD009876",
      title: "Garbage not collected in Sector 4",
      status: "In Progress",
      color: "warning",
      dept: "Sanitation",
      date: "2025-10-21",
    },
    {
      id: "JD009875",
      title: "Streetlight not working near temple",
      status: "Resolved",
      color: "success",
      dept: "Electricity",
      date: "2025-10-20",
    },
    {
      id: "JD009874",
      title: "Water leakage in Ward 11",
      status: "Pending",
      color: "error",
      dept: "Water Supply",
      date: "2025-10-19",
    },
  ];

  return (
    <>
      {/* 🎯 HERO SECTION */}
      <Box
        className="hero-banner"
        sx={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <Box
          className="hero-overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // black overlay with 50% opacity
          }}
        />
        <Container style={{zIndex:"9999"}}>
          <Row>
            <Col md={12} className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h2" sx={{ fontWeight: 900, mb: 2 }}>
                  जनता दरबार
                </Typography>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Citizen Complaint Management System
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "1.1rem", mb: 4 }}>
                  आपकी आवाज, हमारी प्राथमिकता। शिकायत दर्ज करें और समाधान पाएं।
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    component={Link}
                    to="/track"
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "#f59e0b",
                      "&:hover": { backgroundColor: "#e08e00" },
                      fontWeight: 700,
                      borderRadius: "50px",
                      px: 4,
                    }}
                  >
                    File Complaint
                  </Button>
                  <Button
                    component={Link}
                    to="/track"
                    variant="outlined"
                    color="inherit"
                    size="large"
                    sx={{
                      borderColor: "#fff",
                      color: "#fff",
                      borderRadius: "50px",
                      fontWeight: 700,
                      px: 4,
                      "&:hover": {
                        backgroundColor: "#fff",
                        color: "#1e3a8a",
                      },
                    }}
                  >
                    Track Complaint
                  </Button>
                </Box>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </Box>

      {/* 📊 STATS SECTION */}
      <Box sx={{ py: 6, background: "#fff" }}>
        <Container>
          <Row className="text-center gy-4">
            {[
              { label: "Complaints Filed", value: "15,234" },
              { label: "Resolved", value: "12,891" },
              { label: "Pending", value: "1,456" },
              { label: "Departments", value: "12" },
            ].map((stat, i) => (
              <Col key={i} xs={6} md={3}>
                <Card elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 900, color: "#1e3a8a" }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: "#6b7280" }}>
                    {stat.label}
                  </Typography>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </Box>

      {/* ⚙️ FEATURES SECTION */}
      <Box sx={{ py: 6, backgroundColor: "#f8fafc" }}>
        <Container>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 900, mb: 1, color: "#1e3a8a" }}
          >
            Why Choose Janta Darbar?
          </Typography>
          <Typography align="center" sx={{ mb: 5, color: "#6b7280" }}>
            Empowering citizens through transparent governance and technology.
          </Typography>

          <Row className="gy-4">
            {features.map((f, i) => (
              <Col key={i} xs={12} md={6} lg={4}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    elevation={4}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      textAlign: "center",
                      height: "100%",
                      background: "#fff",
                    }}
                  >
                    {f.icon}
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
                      {f.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: "#6b7280" }}
                    >
                      {f.text}
                    </Typography>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </Box>

      {/* 🏛️ DEPARTMENTS */}
      <Box sx={{ py: 6, background: "#fff" }}>
        <Container>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 900, mb: 1, color: "#1e3a8a" }}
          >
            Government Departments
          </Typography>
          <Typography align="center" sx={{ mb: 5, color: "#6b7280" }}>
            Choose the department relevant to your complaint
          </Typography>

          <Row className="gy-4 text-center">
            {departments.map((d, i) => (
              <Col key={i} xs={12} sm={6} md={4}>
                <Card
                  elevation={3}
                  sx={{
                    p: 4,
                    borderTop: `4px solid ${d.color}`,
                    borderRadius: 3,
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-5px)" },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#1e3a8a" }}
                  >
                    {d.name}
                  </Typography>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </Box>

      {/* 🧾 RECENT COMPLAINTS */}
      <Box sx={{ py: 6, backgroundColor: "#f8fafc" }}>
        <Container>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 900, mb: 1, color: "#1e3a8a" }}
          >
            Recent Complaints
          </Typography>
          <Typography align="center" sx={{ mb: 5, color: "#6b7280" }}>
            Track the latest updates from our citizens
          </Typography>

          <Row className="justify-content-center">
            <Col lg={8}>
              {complaints.map((c) => (
                <Card
                  key={c.id}
                  elevation={2}
                  sx={{
                    mb: 3,
                    p: 2,
                    borderLeft: `5px solid ${
                      c.color === "warning"
                        ? "#f59e0b"
                        : c.color === "error"
                        ? "#ef4444"
                        : "#22c55e"
                    }`,
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {c.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        #{c.id} • {c.date}
                      </Typography>
                    </Box>
                    <Chip
                      label={c.status}
                      color={c.color}
                      variant="outlined"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Chip
                      label={c.dept}
                      variant="filled"
                      color="default"
                      sx={{ fontWeight: 600 }}
                    />
                    <Button variant="outlined" size="small">
                      View Details
                    </Button>
                  </Box>
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      </Box>

      {/* 📢 CALL TO ACTION */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(90deg, #1e3a8a, #312e81)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
            Ready to File Your Complaint?
          </Typography>
          <Typography sx={{ mb: 4, fontSize: "1.1rem" }}>
            आपकी शिकायत महत्वपूर्ण है — चलिए साथ मिलकर समाधान करते हैं।
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              component={Link}
              to="/track"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#f59e0b",
                "&:hover": { backgroundColor: "#e08e00" },
                px: 4,
                fontWeight: 700,
                borderRadius: "50px",
              }}
            >
              Submit Complaint
            </Button>
            <Button
              component={Link}
              to="/contact"
              variant="outlined"
              color="inherit"
              size="large"
              sx={{
                borderColor: "#fff",
                color: "#fff",
                borderRadius: "50px",
                px: 4,
                fontWeight: 700,
                "&:hover": { backgroundColor: "#fff", color: "#1e3a8a" },
              }}
            >
              Contact Support
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
