import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Row, Col } from "react-bootstrap";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import DescriptionIcon from "@mui/icons-material/Description";
import TitleIcon from "@mui/icons-material/Title";
import CategoryIcon from "@mui/icons-material/Category";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import RoomIcon from "@mui/icons-material/Room";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BadgeIcon from "@mui/icons-material/Badge";
import axios from "../../../api/axiosConfig";
import useAuth from "../../../hooks/useAuth";

export default function AddVisitComplaint() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    district: "",
    village: "",
    area: "",
    landmark: "",
    complainantName: "",
    complainantPhone: "",
    title: "",
    category: "",
    description: "",
    additionalNotes: "",
    attachment: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const categories = [
    "Water Supply",
    "Electricity",
    "Road / Infrastructure",
    "Public Health",
    "Garbage & Sanitation",
    "Safety",
    "Education",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm({ ...form, attachment: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      const { data } = await axios.post("/officer/visit-complaints", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(`✅ Complaint recorded successfully for ${data.complaint.village}`);
      setForm({
        district: "",
        village: "",
        area: "",
        landmark: "",
        complainantName: "",
        complainantPhone: "",
        title: "",
        category: "",
        description: "",
        additionalNotes: "",
        attachment: null,
      });
    } catch (err) {
      console.error("❌ Failed to add complaint:", err);
      setMessage("❌ Failed to add complaint.");
    } finally {
      setLoading(false);
    }
  };

  const now = new Date().toLocaleString();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 800,
              mb: 4,
              color: "#1e3a8a",
            }}
          >
            Officer Visit Complaint Form
          </Typography>

          {message && (
            <Alert
              severity={message.startsWith("✅") ? "success" : "error"}
              sx={{ mb: 3 }}
            >
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* 🧑 Officer & Date */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#f9fafb", borderRadius: 3 }}>
              <Row className="gy-3">
                <Col md={6}>
                  <TextField
                    label="Officer name"
                    value={`${user?.firstName || ""} ${user?.lastName || ""}`}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
                <Col md={6}>
                  <TextField
                    label="Date & time"
                    value={now}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
              </Row>
            </Paper>

            {/* 📍 Location Info */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#f9fafb", borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#1e3a8a" }}>
                Location details
              </Typography>
              <Row className="gy-4">
                <Col md={6}>
                  <TextField
                    label="District"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCityIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
                <Col md={6}>
                  <TextField
                    label="Village / Ward"
                    name="village"
                    value={form.village}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Col>
                <Col md={6}>
                  <TextField
                    label="Area / Kasba"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    fullWidth
                  />
                </Col>
                <Col md={6}>
                  <TextField
                    label="Landmark"
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RoomIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
              </Row>
            </Paper>

            {/* 👤 Complainant Info */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#f9fafb", borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#1e3a8a" }}>
                Complainant details
              </Typography>
              <Row className="gy-4">
                <Col md={6}>
                  <TextField
                    label="Full name"
                    name="complainantName"
                    value={form.complainantName}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
                <Col md={6}>
                  <TextField
                    label="Contact number"
                    name="complainantPhone"
                    value={form.complainantPhone}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
              </Row>
            </Paper>

            {/* 🧾 Complaint Info */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#f9fafb", borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#1e3a8a" }}>
                Complaint information
              </Typography>
              <Row className="gy-4">
                <Col md={12}>
                  <TextField
                    label="Complaint title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TitleIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
                <Col md={6}>
                  <TextField
                    select
                    label="Category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>
                </Col>
                <Col md={12}>
                  <TextField
                    label="Complaint description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={3}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
                <Col md={12}>
                  <TextField
                    label="Additional notes"
                    name="additionalNotes"
                    value={form.additionalNotes}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NoteAltIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
              </Row>
            </Paper>

            {/* 📎 Attachments */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#f9fafb", borderRadius: 3 }}>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  borderColor: "#1e3a8a",
                  color: "#1e3a8a",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#eff6ff" },
                }}
              >
                Upload attachment (photo/pdf)
                <input
                  type="file"
                  hidden
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </Button>
              {form.attachment && (
                <Typography variant="body2" sx={{ mt: 1, ml: 1 }}>
                  📎 {form.attachment.name}
                </Typography>
              )}
            </Paper>

            {/* Submit Button */}
            <Box textAlign="center">
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  bgcolor: "#1e3a8a",
                  px: 6,
                  py: 1.4,
                  borderRadius: 3,
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#1d4ed8" },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={22} sx={{ color: "white", mr: 1 }} />
                    Saving...
                  </>
                ) : (
                  "Submit Complaint"
                )}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
