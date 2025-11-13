import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Verified,
  Public,
  QueryStats,
  EmojiPeople,
  Timeline,
  CheckCircle,
  AccountBalance,
  ArrowRightAlt,
} from "@mui/icons-material";

export default function About() {
  const processSteps = [
    {
      icon: <Public color="primary" sx={{ fontSize: 48 }} />,
      title: "Submit Complaint",
      desc: "नागरिक अपनी शिकायत ऑनलाइन पोर्टल के माध्यम से दर्ज करते हैं।",
    },
    {
      icon: <QueryStats color="secondary" sx={{ fontSize: 48 }} />,
      title: "Review & Assign",
      desc: "संबंधित विभाग शिकायत की समीक्षा कर कार्यवाही सौंपता है।",
    },
    {
      icon: <Timeline color="warning" sx={{ fontSize: 48 }} />,
      title: "Investigation",
      desc: "विभाग शिकायत की जांच करता है और उचित समाधान ढूंढता है।",
    },
    {
      icon: <CheckCircle color="success" sx={{ fontSize: 48 }} />,
      title: "Resolution",
      desc: "शिकायत हल की जाती है और नागरिक को सूचित किया जाता है।",
    },
  ];

  const values = [
    {
      icon: <Verified sx={{ fontSize: 48, color: "#f59e0b" }} />,
      title: "Transparency",
      desc: "हर शिकायत की स्थिति नागरिक के लिए दृश्यमान होती है।",
    },
    {
      icon: <AccountBalance sx={{ fontSize: 48, color: "#3b82f6" }} />,
      title: "Accountability",
      desc: "प्रत्येक विभाग समय पर समाधान के लिए उत्तरदायी है।",
    },
    {
      icon: <EmojiPeople sx={{ fontSize: 48, color: "#16a34a" }} />,
      title: "Empowerment",
      desc: "जनता दरबार नागरिकों को अपनी आवाज़ उठाने का अधिकार देता है।",
    },
  ];

  return (
    <>
      {/* 🏛️ HERO SECTION */}
      <Box
        className="about-hero"
        sx={{
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)",
          color: "#fff",
          py: 10,
          textAlign: "center",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 2 }}>
              About <span style={{ color: "#fbbf24" }}>Janta Darbar</span>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: "800px",
                mx: "auto",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              एक पारदर्शी और जवाबदेह शिकायत निवारण प्रणाली जो नागरिकों को
              सरकारी सेवाओं में सुधार के लिए सशक्त बनाती है।
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* 🎯 MISSION SECTION */}
      <Box sx={{ py: 8, background: "#fff" }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, color: "#1e3a8a", mb: 2 }}
              >
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ color: "#475569", mb: 3 }}>
                जनता दरबार का उद्देश्य सरकार और नागरिकों के बीच पारदर्शिता
                स्थापित करना है — ताकि हर आवाज़ सुनी जा सके और हर समस्या का
                समाधान समय पर किया जा सके।
              </Typography>
              <Typography variant="body1" sx={{ color: "#475569" }}>
                Our goal is to make governance accessible, responsive, and
                citizen-friendly using technology and accountability.
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Row>
                <Col md={6}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#f59e0b" }}
                  >
                    98%
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>
                    Resolution Rate
                  </Typography>
                </Col>
                <Col md={6}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#2563eb" }}
                  >
                    7 Days
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>
                    Avg. Resolution Time
                  </Typography>
                </Col>
              </Row>
            </Col>

            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  elevation={5}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    Serving Citizens Since 2020
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Over 15,000 monthly users rely on our transparent platform
                    to register and resolve complaints across multiple
                    departments.
                  </Typography>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </Box>

      {/* ⚙️ PROCESS FLOW */}
      <Box sx={{ py: 8, background: "#f8fafc" }}>
        <Container>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 900, mb: 2, color: "#1e3a8a" }}
          >
            How It Works
          </Typography>
          <Typography
            align="center"
            sx={{ mb: 6, color: "#6b7280", fontSize: "1.05rem" }}
          >
            शिकायत से समाधान तक — चार सरल चरणों में आपकी सेवा में
          </Typography>

          <Row className="gy-4 text-center">
            {processSteps.map((step, i) => (
              <Col key={i} xs={12} sm={6} lg={3}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: "#fff",
                      height: "100%",
                    }}
                  >
                    <Box sx={{ mb: 2 }}>{step.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.desc}
                    </Typography>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </Box>

      {/* 🧭 CORE VALUES */}
      <Box sx={{ py: 8, background: "#fff" }}>
        <Container>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 900, mb: 5, color: "#1e3a8a" }}
          >
            Our Core Values
          </Typography>
          <Row className="gy-4 text-center">
            {values.map((v, i) => (
              <Col key={i} xs={12} md={4}>
                <Card
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-5px)" },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{v.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {v.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280", mt: 1 }}
                  >
                    {v.desc}
                  </Typography>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </Box>

      {/* 🔄 DEPARTMENT TRANSFER TIMELINE */}
      <Box sx={{ py: 8, background: "#f8fafc" }}>
        <Container>
          <Row className="align-items-start">
            <Col lg={6}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, mb: 3, color: "#1e3a8a" }}
              >
                Department Transfer System
              </Typography>
              <Typography variant="body1" sx={{ color: "#475569", mb: 3 }}>
                यदि कोई शिकायत निर्धारित समय सीमा के भीतर हल नहीं होती है या यह
                किसी अन्य विभाग से संबंधित है, तो इसे स्वचालित रूप से सही विभाग
                में स्थानांतरित किया जाता है।
              </Typography>
              <Typography variant="body1" sx={{ color: "#475569" }}>
                This ensures no complaint remains unattended, guaranteeing every
                citizen gets a timely resolution.
              </Typography>
            </Col>

            <Col lg={6}>
              <Box className="timeline">
                {[
                  "Initial Department Review",
                  "Investigation & Follow-up",
                  "Auto Transfer if Required",
                  "Final Resolution & Feedback",
                ].map((step, i) => (
                  <div className="timeline-item" key={i}>
                    <div className="timeline-dot"></div>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {step}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#6b7280", mb: 2 }}
                    >
                      Step {i + 1} in complaint handling workflow.
                    </Typography>
                  </div>
                ))}
              </Box>
            </Col>
          </Row>
        </Container>
      </Box>

      {/* 📣 CTA SECTION */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(90deg, #1e3a8a, #312e81)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
            Together, We Can Build a Better System
          </Typography>
          <Typography sx={{ mb: 4, fontSize: "1.1rem" }}>
            जनता दरबार — जहाँ आपकी शिकायत ही हमारी प्राथमिकता है।
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="warning"
            endIcon={<ArrowRightAlt />}
            sx={{
              fontWeight: 700,
              px: 4,
              borderRadius: "50px",
              backgroundColor: "#f59e0b",
              "&:hover": { backgroundColor: "#e08e00" },
            }}
          >
            File Your Complaint
          </Button>
        </Container>
      </Box>
    </>
  );
}
