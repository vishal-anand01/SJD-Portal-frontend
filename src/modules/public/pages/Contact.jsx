import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  AccessTime,
  Send,
  SupportAgent,
} from "@mui/icons-material";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <>
      {/* 💬 HERO SECTION */}
      <Box
        className="contact-hero"
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
              Contact <span style={{ color: "#fbbf24" }}>Us</span>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: "700px",
                mx: "auto",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              आपकी शिकायत महत्वपूर्ण है — हम आपकी सहायता के लिए यहाँ हैं।
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* 🧭 CONTACT INFO SECTION */}
      <Box sx={{ py: 8, background: "#fff" }}>
        <Container>
          <Row className="gy-4">
            <Col md={4}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Card elevation={3} sx={{ p: 4, borderRadius: 3, height: "100%" }}>
                  <Box sx={{ mb: 2 }}>
                    <SupportAgent
                      sx={{ fontSize: 50, color: "#f59e0b" }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Customer Support
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
                    Get help from our dedicated support team 24/7.
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2">
                    <strong>Email:</strong> support@sjd-portal.gov.in
                  </Typography>
                  <Typography variant="body2">
                    <strong>Helpline:</strong> +91 1800-2025-111
                  </Typography>
                </Card>
              </motion.div>
            </Col>

            <Col md={4}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Card elevation={3} sx={{ p: 4, borderRadius: 3, height: "100%" }}>
                  <Box sx={{ mb: 2 }}>
                    <LocationOn
                      sx={{ fontSize: 50, color: "#2563eb" }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Our Office
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
                    Janta Darbar Headquarters, Smart Governance Bhawan,
                    Lucknow, Uttar Pradesh - 226010
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2">
                    <strong>Working Days:</strong> Monday - Saturday
                  </Typography>
                  <Typography variant="body2">
                    <strong>Office Hours:</strong> 9:00 AM - 6:00 PM
                  </Typography>
                </Card>
              </motion.div>
            </Col>

            <Col md={4}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Card elevation={3} sx={{ p: 4, borderRadius: 3, height: "100%" }}>
                  <Box sx={{ mb: 2 }}>
                    <AccessTime sx={{ fontSize: 50, color: "#16a34a" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Quick Response
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
                    Our team aims to respond within 24 hours of receiving your query.
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2">
                    <strong>Emergency Line:</strong> +91 98765-43210
                  </Typography>
                  <Typography variant="body2">
                    <strong>SMS Keyword:</strong> JDHELP
                  </Typography>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </Box>

      {/* 📩 CONTACT FORM SECTION */}
      <Box sx={{ py: 8, backgroundColor: "#f8fafc" }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, mb: 3, color: "#1e3a8a" }}
              >
                Send Us a Message
              </Typography>
              <Typography variant="body1" sx={{ color: "#475569", mb: 4 }}>
                Have any query or issue? Fill the form below, and our support
                team will get back to you as soon as possible.
              </Typography>

              <Box
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  backgroundColor: "#fff",
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 2,
                }}
              >
                <TextField label="Full Name" variant="outlined" fullWidth />
                <TextField label="Email Address" variant="outlined" fullWidth />
                <TextField label="Mobile Number" variant="outlined" fullWidth />
                <TextField
                  label="Your Message"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                />
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<Send />}
                  sx={{
                    mt: 2,
                    backgroundColor: "#f59e0b",
                    "&:hover": { backgroundColor: "#e08e00" },
                    borderRadius: "50px",
                    fontWeight: 700,
                    px: 4,
                    alignSelf: "flex-start",
                  }}
                >
                  Submit Message
                </Button>
              </Box>
            </Col>

            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  elevation={4}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    height: "100%",
                    background: "#fff",
                  }}
                >
                  <iframe
                    title="Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.901604389615!2d80.9461655752065!3d26.84669358315785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2d0b8a51c7f%3A0x8e4368f74a02d705!2sLucknow%20Collectorate!5e0!3m2!1sen!2sin!4v1698754433335!5m2!1sen!2sin"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </Box>

      {/* 📢 CTA SECTION */}
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
            We’re Here to Help!
          </Typography>
          <Typography sx={{ mb: 4, fontSize: "1.1rem" }}>
            कोई भी प्रश्न, सुझाव या सहायता की आवश्यकता हो — हमसे तुरंत संपर्क करें।
          </Typography>
          <Button
            href="mailto:support@sjd-portal.gov.in"
            variant="contained"
            size="large"
            color="warning"
            sx={{
              px: 4,
              py: 1.2,
              fontWeight: 700,
              borderRadius: "50px",
              backgroundColor: "#f59e0b",
              "&:hover": { backgroundColor: "#e08e00" },
            }}
          >
            Email Support Now
          </Button>
        </Container>
      </Box>
    </>
  );
}
