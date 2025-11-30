import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Box,
  Button,
  Typography,
  TextField,
  Card,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = React.useState({ email: "", password: "" });

  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
    general: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });

    try {
      const res = await login(form);
      const role = res?.user?.role;

      if (role === "admin" || role === "superadmin") navigate("/admin/dashboard");
      else if (role === "officer") navigate("/officer/dashboard");
      else if (role === "department") navigate("/department/dashboard");
      else navigate("/public/dashboard");
    } catch (error) {
      const err = error?.response?.data;

      if (err?.field === "email") {
        setErrors((prev) => ({ ...prev, email: err.message }));
      } else if (err?.field === "password") {
        setErrors((prev) => ({ ...prev, password: err.message }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: err?.message || "Something went wrong.",
        }));
      }
    }
  };

  return (
    <>
      {/* -------- HERO SECTION -------- */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
          color: "#fff",
          py: 8,
          textAlign: "center",
          boxShadow: "0 4px 40px rgba(0,0,0,0.2)",
        }}
      >
        <Container>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 2,
              letterSpacing: "1px",
              fontSize: { xs: "2.2rem", md: "3.2rem" },
            }}
          >
            Welcome to{" "}
            <span style={{ color: "#fbbf24" }}>SJD-Portal</span>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              maxWidth: "650px",
              mx: "auto",
              opacity: 0.8,
              fontSize: { xs: "1rem", md: "1.2rem" },
            }}
          >
            आपकी शिकायत — हमारी प्राथमिकता। लॉगिन करके तुरंत अपने डैशबोर्ड पर जाएं।
          </Typography>
        </Container>
      </Box>

      {/* -------- LOGIN SECTION -------- */}
      <div
        style={{
          minHeight: "calc(100vh - 250px)",
          background: "linear-gradient(180deg, #e2e8f0, #f8fafc)",
          display: "flex",
          alignItems: "center",
          padding: "3rem 0",
        }}
      >
        <Container>
          <Row className="justify-content-center align-items-center">
            {/* ---------- LOGIN CARD ---------- */}
            <Col md={6} lg={5}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                  },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                    textAlign: "center",
                    color: "#1e3a8a",
                  }}
                >
                  Sign In
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    mb: 3,
                    color: "#475569",
                  }}
                >
                  Access your{" "}
                  <span style={{ color: "#f59e0b", fontWeight: 700 }}>
                    SJD-Portal Dashboard
                  </span>
                </Typography>

                <Form onSubmit={handleSubmit}>
                  {/* EMAIL */}
                  <Form.Group className="mb-3">
                    <TextField
                      label="Email Address"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      fullWidth
                      size="medium"
                      required
                      error={Boolean(errors.email)}
                      helperText={errors.email}
                    />
                  </Form.Group>

                  {/* PASSWORD */}
                  <Form.Group className="mb-3">
                    <TextField
                      label="Password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      fullWidth
                      size="medium"
                      required
                      error={Boolean(errors.password)}
                      helperText={errors.password}
                    />
                  </Form.Group>

                  {/* GENERAL ERROR */}
                  {errors.general && (
                    <div
                      style={{
                        backgroundColor: "#fee2e2",
                        border: "1px solid #f87171",
                        borderRadius: "10px",
                        padding: "0.8rem",
                        color: "#b91c1c",
                        marginBottom: "1rem",
                        fontSize: "0.95rem",
                        textAlign: "center",
                      }}
                    >
                      ⚠️ {errors.general}
                    </div>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        background: "linear-gradient(90deg,#1e3a8a,#1d4ed8)",
                        fontWeight: 700,
                        px: 4,
                        py: 1,
                        fontSize: "1rem",
                        borderRadius: "10px",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg,#1d4ed8,#1e40af)",
                        },
                      }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress
                            size={22}
                            sx={{ color: "#fff", mr: 1 }}
                          />
                          Signing in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>

                    <Link to="/forgot-password" style={{ fontSize: "0.9rem" }}>
                      Forgot Password?
                    </Link>
                  </Box>
                </Form>

                {/* REGISTER LINK */}
                <Box sx={{ mt: 4, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#475569" }}>
                    New to platform?{" "}
                    <Link to="/register" style={{ color: "#1e3a8a" }}>
                      Create an Account
                    </Link>
                  </Typography>
                </Box>
              </Card>
            </Col>

            {/* -------- INFO PANEL -------- */}
            <Col
              md={6}
              lg={7}
              className="d-none d-md-flex"
              style={{ justifyContent: "center" }}
            >
              <Box
                sx={{
                  background: "linear-gradient(135deg,#1e3a8a,#312e81)",
                  borderRadius: "24px",
                  padding: "3rem",
                  color: "#fff",
                  width: "100%",
                  maxWidth: "600px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    mb: 2,
                    color: "#fbbf24",
                  }}
                >
                  Why Use SJD-Portal?
                </Typography>

                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                  आधुनिक, तेज़ और सुरक्षित — ट्रैक करें अपनी शिकायतें और निरीक्षण।
                </Typography>

                <ul style={{ opacity: 0.9, fontSize: "1.05rem" }}>
                  <li>⚡ Real-Time Complaint Tracking</li>
                  <li>⚡ Smart AI Categorization</li>
                  <li>⚡ Visit & Map Tracking</li>
                  <li>⚡ PDF / Excel Report Export</li>
                  <li>⚡ Push Notifications</li>
                </ul>
              </Box>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
