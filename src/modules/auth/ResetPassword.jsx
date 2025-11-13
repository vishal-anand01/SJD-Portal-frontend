// Path: frontend/src/modules/auth/ResetPassword.jsx
import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../../api/authApi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ password: "", confirm: "" });
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.confirm) { setErr("Passwords do not match"); return; }
    setLoading(true);
    try {
      await resetPasswordApi(token, { password: form.password });
      navigate("/login");
    } catch (error) {
      setErr(error?.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center" style={{ minHeight: "60vh" }}>
        <Col md={6}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Reset Password</Typography>

            <Form onSubmit={submit}>
              <Form.Group className="mb-2">
                <TextField label="New Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} fullWidth size="small" />
              </Form.Group>
              <Form.Group className="mb-2">
                <TextField label="Confirm Password" type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} fullWidth size="small" />
              </Form.Group>

              {err && <div className="alert alert-danger">{err}</div>}

              <Box sx={{ mt: 2 }}>
                <Button variant="contained" type="submit" disabled={loading}>{loading ? "Resetting..." : "Reset password"}</Button>
              </Box>
            </Form>
          </Box>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
