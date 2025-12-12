import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography, Box, Divider, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        color: "#e2e8f0",
        paddingTop: "4rem",
        paddingBottom: "0",
        overflow: "hidden",
      }}
    >
      <Container>
        <Row className="gy-5">
          {/* Column 1 */}
          <Col md={4}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: "#fbbf24",
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
             सरकार जनता के द्वार
            </Typography>

            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                lineHeight: 1.8,
                fontSize: "0.95rem",
                mb: 2,
              }}
            >
              <b>SJD-Portal</b> — A next-generation grievance management platform
              that bridges the gap between citizens and governance. Track
              complaints, request services, and ensure transparency at every
              step.
            </Typography>

            {/* Emotional Line */}
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
                color: "#facc15",
                mb: 2,
                fontSize: "0.9rem",
              }}
            >
              आपकी आवाज़, हमारी ज़िम्मेदारी — Empowering Every Citizen 🇮🇳
            </Typography>

            {/* Social Media Icons */}
            <Box
              sx={{
                mt: 3,
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {[
                { icon: "facebook", color: "#3b5998" },
                { icon: "twitter-x", color: "#1da1f2" },
                { icon: "instagram", color: "#e1306c" },
                { icon: "linkedin", color: "#0a66c2" },
                { icon: "youtube", color: "#ff0000" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label={social.icon}
                  style={{
                    color: "#fbbf24",
                    fontSize: "1.5rem",
                    transition: "0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = social.color)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#fbbf24")
                  }
                >
                  <i className={`bi bi-${social.icon}`}></i>
                </a>
              ))}
            </Box>
          </Col>

          {/* Column 2 */}
          <Col md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#fbbf24",
                mb: 2,
                fontSize: "1rem",
                textTransform: "uppercase",
              }}
            >
              Quick Links
            </Typography>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                lineHeight: "2",
                fontSize: "0.95rem",
              }}
            >
              {[
                { name: "Home", path: "/", icon: "house-door" },
                { name: "About", path: "/about", icon: "info-circle" },
                {
                  name: "Track Complaint",
                  path: "/track",
                  icon: "binoculars",
                },
                { name: "Contact", path: "/contact", icon: "envelope" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    style={{
                      color: "#e2e8f0",
                      textDecoration: "none",
                    }}
                  >
                    <i
                      className={`bi bi-${link.icon} me-2 text-saffron`}
                    ></i>{" "}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Language Switcher */}
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: "#fbbf24",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Language
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {["English", "हिंदी"].map((lang) => (
                  <Button
                    key={lang}
                    size="small"
                    variant="outlined"
                    sx={{
                      color: "#fbbf24",
                      borderColor: "#fbbf24",
                      "&:hover": { background: "#fbbf24", color: "#0f172a" },
                      borderRadius: "6px",
                      textTransform: "none",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {lang}
                  </Button>
                ))}
              </Box>
            </Box>
          </Col>

          {/* Column 3 */}
          <Col md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#fbbf24",
                mb: 2,
                fontSize: "1rem",
                textTransform: "uppercase",
              }}
            >
              Stay Updated
            </Typography>

            <Typography
              variant="body2"
              sx={{ opacity: 0.9, mb: 2, lineHeight: 1.6 }}
            >
              Subscribe to get the latest updates on city services, features,
              and announcements directly in your inbox.
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                placeholder="Enter your email"
                variant="outlined"
                sx={{
                  input: {
                    background: "white",
                    borderRadius: "6px",
                    px: 1.5,
                    fontSize: "0.9rem",
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  background: "#fbbf24",
                  color: "#0f172a",
                  fontWeight: 700,
                  "&:hover": { background: "#facc15" },
                  borderRadius: "6px",
                }}
              >
                Subscribe
              </Button>
            </Box>

            {/* Contact Info */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <i className="bi bi-geo-alt-fill me-2 text-saffron"></i> City
                Service Office, Main Secretariat
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <i className="bi bi-envelope-fill me-2 text-saffron"></i>{" "}
                support@sjdportal.gov.in
              </Typography>
              <Typography variant="body2">
                <i className="bi bi-telephone-fill me-2 text-saffron"></i> +91
                98765 43210
              </Typography>
            </Box>
          </Col>
        </Row>

        <Divider
          sx={{
            my: 4,
            backgroundColor: "rgba(255,255,255,0.15)",
          }}
        />

        {/* Sub-Footer */}
        <Box
          sx={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "0.9rem",
            pb: 3,
          }}
        >
          <div style={{ marginBottom: "4px" }}>
            <Link
              to="/privacy-policy"
              style={{
                color: "#fbbf24",
                textDecoration: "none",
                marginRight: "12px",
              }}
            >
              Privacy Policy
            </Link>
            |
            <Link
              to="/terms"
              style={{
                color: "#fbbf24",
                textDecoration: "none",
                marginLeft: "12px",
              }}
            >
              Terms of Use
            </Link>
          </div>
          <Typography variant="body2">
            © {new Date().getFullYear()}{" "}
            <span style={{ color: "#fbbf24" }}>SJD-Portal</span> | Designed for
            Citizens | Developed with ❤️ by <b>Vishal Anand</b>
          </Typography>
        </Box>
      </Container>
    </footer>
  );
}
