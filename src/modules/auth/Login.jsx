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
  const [err, setErr] = React.useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await login(form);
      const role = res?.user?.role; // ✅ Directly use user.role from AuthContext

      if (role === "admin" || role === "superadmin") {
        navigate("/admin/dashboard");
      } else if (role === "officer") {
        navigate("/officer/dashboard");
      } else if (role === "department") {
        navigate("/department/dashboard");
      } else {
        navigate("/public/dashboard"); // optional or homepage
      }
    } catch (error) {
      setErr(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <>
      {/* 🌟 HERO SECTION */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)",
          color: "#fff",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Sign In to <span style={{ color: "#fbbf24" }}>SJD-Portal</span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: "700px",
              mx: "auto",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            आपकी शिकायत महत्वपूर्ण है — लॉगिन करें और अपनी भूमिका के अनुसार
            डैशबोर्ड पर जाएं।
          </Typography>
        </Container>
      </Box>

      {/* 🟦 MAIN LOGIN SECTION */}
      <div
        style={{
          minHeight: "calc(100vh - 200px)",
          background: "linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)",
          display: "flex",
          alignItems: "center",
          padding: "3rem 0",
        }}
      >
        <Container>
          <Row className="justify-content-center align-items-center">
            {/* Login Card */}
            <Col md={6} lg={5}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: "16px",
                  padding: "2.5rem",
                  backgroundColor: "#fff",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    mb: 1,
                    textAlign: "center",
                    color: "#1e3a8a",
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    mb: 3,
                    color: "#475569",
                  }}
                >
                  Sign in to continue to{" "}
                  <span style={{ fontWeight: 700, color: "#f59e0b" }}>
                    SJD-Portal
                  </span>
                </Typography>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <TextField
                      label="Email Address"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <TextField
                      label="Password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      required
                    />
                  </Form.Group>

                  {err && (
                    <div
                      style={{
                        backgroundColor: "#fee2e2",
                        border: "1px solid #f87171",
                        borderRadius: "8px",
                        padding: "0.75rem",
                        color: "#b91c1c",
                        marginBottom: "1rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      ⚠️ {err}
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
                        backgroundColor: "#1e3a8a",
                        "&:hover": { backgroundColor: "#1d4ed8" },
                        borderRadius: "8px",
                        fontWeight: 700,
                        px: 3,
                      }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress
                            size={20}
                            sx={{ color: "#fff", mr: 1 }}
                          />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>

                    <Link to="/forgot-password" className="small">
                      Forgot Password?
                    </Link>
                  </Box>
                </Form>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#475569" }}>
                    Don’t have an account?{" "}
                    <Link to="/register" style={{ color: "#1e3a8a" }}>
                      Register
                    </Link>
                  </Typography>
                </Box>
              </Card>
            </Col>

            {/* Info Section */}
            <Col
              md={6}
              lg={7}
              className="d-none d-md-block"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)",
                  borderRadius: "20px",
                  padding: "3rem",
                  color: "#fff",
                  minHeight: "380px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    color: "#fbbf24",
                  }}
                >
                  Welcome to SJD-Portal
                </Typography>

                <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                  नागरिकों और अधिकारियों को जोड़ने वाला एक प्लेटफॉर्म — Track
                  complaints, manage visits, and generate reports seamlessly.
                </Typography>

                <ul style={{ marginLeft: "1rem", opacity: 0.9 }}>
                  <li>✅ Real-time complaint tracking</li>
                  <li>✅ Smart AI categorization</li>
                  <li>✅ PDF / Excel report export</li>
                  <li>✅ Push notifications & map tracking</li>
                </ul>
              </Box>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
