import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CircularProgress,
} from "@mui/material";
import { forgotPasswordApi } from "../../api/authApi";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMessage("");
    setLoading(true);

    try {
      await forgotPasswordApi({ email });
      setMessage("If this email exists, a reset link has been sent to your inbox.");
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
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
            Forgot <span style={{ color: "#fbbf24" }}>Password?</span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: "700px",
              mx: "auto",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            पासवर्ड भूल गए? चिंता मत करें — अपना ईमेल दर्ज करें और हम आपको रीसेट लिंक भेज देंगे।
          </Typography>
        </Container>
      </Box>

      {/* 🔐 MAIN SECTION */}
      <div
        style={{
          minHeight: "calc(100vh - 200px)",
          background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
          display: "flex",
          alignItems: "center",
          padding: "3rem 0",
        }}
      >
        <Container>
          <Row className="justify-content-center align-items-center">
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
                    mb: 2,
                    textAlign: "center",
                    color: "#1e3a8a",
                  }}
                >
                  Reset Your Password
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    mb: 3,
                    color: "#475569",
                  }}
                >
                  Enter your registered email to receive a password reset link.
                </Typography>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <TextField
                      label="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      size="small"
                      required
                    />
                  </Form.Group>

                  {message && (
                    <div
                      style={{
                        backgroundColor: "#dcfce7",
                        border: "1px solid #22c55e",
                        borderRadius: "8px",
                        padding: "0.75rem",
                        color: "#166534",
                        marginBottom: "1rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      ✅ {message}
                    </div>
                  )}

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

                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        backgroundColor: "#1e3a8a",
                        "&:hover": { backgroundColor: "#1d4ed8" },
                        borderRadius: "8px",
                        fontWeight: 700,
                        px: 4,
                        py: 1,
                      }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress
                            size={20}
                            sx={{ color: "#fff", mr: 1 }}
                          />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </Box>
                </Form>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#475569" }}>
                    Remember your password?{" "}
                    <Link to="/login" style={{ color: "#1e3a8a" }}>
                      Go back to Login
                    </Link>
                  </Typography>
                </Box>
              </Card>
            </Col>

            {/* 🟣 Info Panel */}
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
                  Secure Password Recovery
                </Typography>

                <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                  Forgetting passwords is common — SJD-Portal ensures secure and
                  quick password recovery via verified email.
                </Typography>

                <ul style={{ marginLeft: "1rem", opacity: 0.9 }}>
                  <li>✅ Verified email reset process</li>
                  <li>✅ Instant reset link delivery</li>
                  <li>✅ Secure encrypted recovery</li>
                  <li>✅ 24x7 support assistance</li>
                </ul>
              </Box>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
