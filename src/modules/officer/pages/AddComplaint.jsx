import React, { useState, useEffect } from "react";
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
  Divider,
} from "@mui/material";
import { Row, Col } from "react-bootstrap";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RoomIcon from "@mui/icons-material/Room";
import DescriptionIcon from "@mui/icons-material/Description";
import TitleIcon from "@mui/icons-material/Title";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MapIcon from "@mui/icons-material/Map";
import axios from "../../../api/axiosConfig";
import { format } from "date-fns";

export default function AddComplaint() {
  const [form, setForm] = useState({
    citizenName: "",
    citizenMobile: "",
    citizenDob: "",
    title: "",
    description: "",
    location: "",
    village: "",
    block: "",
    tehsil: "",
    district: "",
    state: "",
    pincode: "",
    landmark: "",
    attachment: null, // ✅ FIXED
  });

  const [officer, setOfficer] = useState({ name: "Loading...", email: "" });
  const [dateTime, setDateTime] = useState(format(new Date(), "PPpp"));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const categories = [
    "Electricity",
    "Road & Infrastructure",
    "Water Supply",
    "Garbage / Cleanliness",
    "Public Safety",
    "Health & Sanitation",
    "Education",
    "Transport",
    "Agriculture",
    "Others",
  ];

  // 🕒 Live updating date-time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(format(new Date(), "PPpp"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 👮 Fetch logged-in officer name
  useEffect(() => {
    const fetchOfficer = async () => {
      try {
        const { data } = await axios.get("/officer/profile");
        if (data?.officer) {
          setOfficer({
            name: `${data.officer.firstName} ${data.officer.lastName}`,
            email: data.officer.email,
          });
        }
      } catch (err) {
        console.error("Error fetching officer:", err);
      }
    };
    fetchOfficer();
  }, []);

  // Handle input
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
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "attachment" && form[key])
          formData.append("attachment", form[key]);
        else formData.append(key, form[key]);
      });

      const { data } = await axios.post("/officer/visit-complaints", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setSuccess(
          `✅ Complaint added successfully (Tracking ID: ${data.complaint.trackingId})`
        );
        setForm({
          citizenName: "",
          citizenMobile: "",
          citizenDob: "",
          title: "",
          description: "",
          location: "",
          village: "",
          block: "",
          tehsil: "",
          district: "",
          state: "",
          pincode: "",
          landmark: "",
          attachment: null,
        });
      } else {
        setError(data.message || "Failed to add complaint.");
      }
    } catch (err) {
      console.error("❌ Error submitting complaint:", err);
      setError(err?.response?.data?.message || "Failed to add complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
        py: 4,
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <Card sx={{ borderRadius: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                fontWeight: 800,
                mb: 3,
                color: "#1e3a8a",
              }}
            >
              📝 Add Complaint (On Behalf of Citizen)
            </Typography>

            {/* Officer Info */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "#eff6ff",
                border: "1px solid #bfdbfe",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "#1e3a8a" }}
              >
                👮 Officer Information
              </Typography>
              <Row>
                <Col md={6}>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Officer Name:</strong> {officer.name}
                  </Typography>
                </Col>
                <Col md={6}>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Current Time:</strong> {dateTime}
                  </Typography>
                </Col>
              </Row>
            </Box>

            <form onSubmit={handleSubmit}>
              {/* Citizen Info */}
              <Typography
                variant="h6"
                sx={{ mt: 2, mb: 2, fontWeight: 700, color: "#1e3a8a" }}
              >
                👤 Citizen Information
              </Typography>
              <Row className="gy-4">
                <Col md={6}>
                  <TextField
                    label="Name"
                    name="citizenName"
                    value={form.citizenName}
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
                    label="Mobile Number"
                    name="citizenMobile"
                    value={form.citizenMobile}
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
                <Col md={6}>
                  <TextField
                    label="Date of Birth"
                    name="citizenDob"
                    type="date"
                    value={form.citizenDob}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
              </Row>

              <Divider sx={{ my: 3 }} />

              {/* Complaint Info */}
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 700, color: "#1e3a8a" }}
              >
                🏢 Complaint Information
              </Typography>

              <Row className="gy-4">
                <Col md={12}>
                  <TextField
                    label="Subject"
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
                    label="Location / Area"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RoomIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                <Col md={6}>
                  <TextField
                    label="Village"
                    name="village"
                    value={form.village}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                <Col md={6}>
                  <TextField
                    label="Block"
                    name="block"
                    value={form.block}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ApartmentIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                <Col md={6}>
                  <TextField
                    label="Tehsil"
                    name="tehsil"
                    value={form.tehsil}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                <Col md={6}>
                  <TextField
                    label="District"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                <Col md={6}>
                  <TextField
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                <Col md={6}>
                  <TextField
                    label="Pincode"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                <Col md={12}>
                  <TextField
                    label="Landmark"
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                <Col md={12}>
                  <TextField
                    label="Complaint Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    minRows={4}
                    placeholder="Describe the issue clearly..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                {/* Attachment */}
                <Col md={12}>
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
                    Upload Attachment (optional)
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                  {form.attachment && (
                    <Typography variant="body2" sx={{ mt: 1, ml: 1 }}>
                      📎 {form.attachment.name}
                    </Typography>
                  )}
                </Col>

                {/* Alerts */}
                {error && (
                  <Col md={12}>
                    <Alert severity="error">{error}</Alert>
                  </Col>
                )}
                {success && (
                  <Col md={12}>
                    <Alert severity="success">{success}</Alert>
                  </Col>
                )}

                {/* Submit */}
                <Col md={12} className="text-center mt-2">
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
                        <CircularProgress
                          size={22}
                          sx={{ color: "white", mr: 1 }}
                        />
                        Submitting...
                      </>
                    ) : (
                      "Submit Complaint"
                    )}
                  </Button>
                </Col>
              </Row>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
