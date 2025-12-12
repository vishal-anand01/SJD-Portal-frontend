import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Typography,
  Avatar,
  Box,
  Tooltip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import axios from "../../../api/axiosConfig";
import dayjs from "dayjs";

// Icons
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WcIcon from "@mui/icons-material/Wc";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import BusinessIcon from "@mui/icons-material/Business";
import MapIcon from "@mui/icons-material/Map";
import PublicIcon from "@mui/icons-material/Public";
import PinDropIcon from "@mui/icons-material/PinDrop";
import VerifiedIcon from "@mui/icons-material/Verified";

export default function DepartmentProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  // 🔵 LOAD PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/department/profile");
        setProfile(data.department);
        setForm(data.department);
      } catch (err) {
        console.error("Failed to load department profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 💾 SAVE PROFILE
  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put("/department/profile", form);
      setProfile(data.department);
      setForm(data.department);
      setEditMode(false);
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#1e3a8a" }} />
      </Box>
    );

  if (!profile)
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">Department profile not found.</Alert>
      </Container>
    );

  const initials =
    profile.firstName?.[0]?.toUpperCase() +
    (profile.lastName?.[0]?.toUpperCase() || "");

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #dbeafe 100%)",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            overflow: "hidden",
            backgroundColor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* 🔷 HEADER */}
          <Box
            sx={{
              background:
                "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)",
              py: 5,
              textAlign: "center",
              color: "white",
            }}
          >
            {/* 🖼️ Avatar */}
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={profile.photo ? `${backendBase}/${profile.photo}` : ""}
                sx={{
                  width: 130,
                  height: 130,
                  mb: 2,
                  border: "4px solid white",
                  bgcolor: profile.photo ? "transparent" : deepOrange[500],
                  fontSize: 45,
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                {!profile.photo && initials}
              </Avatar>

              {/* ✏️ Edit Photo */}
              <label
                htmlFor="photo-upload"
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  background: "#2563eb",
                  borderRadius: "50%",
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "2px solid white",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                <input
                  id="photo-upload"
                  type="file"
                  hidden
                  accept="image/*,application/pdf"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const fd = new FormData();
                    Object.keys(form).forEach((k) => fd.append(k, form[k]));
                    fd.append("photo", file);

                    try {
                      const { data } = await axios.put(
                        "/department/profile",
                        fd,
                        { headers: { "Content-Type": "multipart/form-data" } }
                      );
                      setForm(data.department);
                      setProfile(data.department);
                      alert("Profile photo updated successfully!");
                    } catch (err) {
                      alert("Photo update failed!");
                    }
                  }}
                />
                ✏️
              </label>
            </Box>

            {/* NAME */}
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              {profile.firstName} {profile.lastName}
            </Typography>

            {/* <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {profile.name}
            </Typography> */}

            {/* Edit / Save */}
            <Box sx={{ mt: 3 }}>
              {!editMode ? (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#f59e0b",
                    fontWeight: 700,
                    px: 3,
                    "&:hover": { backgroundColor: "#d97706" },
                  }}
                  onClick={() => setEditMode(true)}
                >
                  ✏️ Edit Profile
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#16a34a",
                    fontWeight: 700,
                    px: 3,
                    "&:hover": { backgroundColor: "#15803d" },
                  }}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "💾 Save Changes"}
                </Button>
              )}
            </Box>
          </Box>

          {/* 🔶 BODY */}
          <Box sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                color: "#1e3a8a",
                fontWeight: 800,
                mb: 4,
                textTransform: "uppercase",
              }}
            >
              Department Information
            </Typography>

            <div className="row gy-4 gx-4">
              {/* SJD ID */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="uniqueId"
                  label="SJD ID"
                  value={form.uniqueId || ""}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <VerifiedIcon color="success" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* First Name */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={form.firstName || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <WcIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Last Name */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={form.lastName || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <WcIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Email */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={form.email || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* DOB */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="dob"
                  type="date"
                  label="Date of Birth"
                  value={form.dob ? dayjs(form.dob).format("YYYY-MM-DD") : ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Gender */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="gender"
                  label="Gender"
                  value={form.gender || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <WcIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Designation */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="designation"
                  label="Designation"
                  value={form.designation || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <VerifiedIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Department Name */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="departmentName"
                  label="Department Name"
                  value={form.departmentName || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Address */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  value={form.address || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* City */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="city"
                  label="City"
                  value={form.city || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCityIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* District */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="district"
                  label="District"
                  value={form.district || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* State */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="state"
                  label="State"
                  value={form.state || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <MapIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Country */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="country"
                  label="Country"
                  value={form.country || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PublicIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Pincode */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="pincode"
                  label="Pincode"
                  value={form.pincode || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PinDropIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>

            {/* 🕒 Last Updated */}
            {profile.updatedAt && (
              <Typography
                variant="body2"
                sx={{
                  mt: 4,
                  textAlign: "center",
                  color: "#6b7280",
                  fontStyle: "italic",
                }}
              >
                Last Updated:{" "}
                {dayjs(profile.updatedAt).format("DD MMM YYYY HH:mm")}
              </Typography>
            )}
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
