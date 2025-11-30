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
import useAuth from "../../../hooks/useAuth";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PublicIcon from "@mui/icons-material/Public";
import VerifiedIcon from "@mui/icons-material/Verified";
import WcIcon from "@mui/icons-material/Wc";
import PinDropIcon from "@mui/icons-material/PinDrop";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";

export default function DMProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  // ✅ Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/dm/profile");
        setProfile(data.dm);
        setForm(data.dm);
      } catch (err) {
        console.error("❌ Failed to load DM profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Save profile updates
  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put("/dm/profile", form);

      if (data.emailChanged) {
        alert(
          "✅ Email updated successfully. Please log in again with your new email."
        );
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      setProfile(data.dm);
      setEditMode(false);
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      alert("Profile update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#1e3a8a" }} />
      </Box>
    );

  if (!profile)
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">DM profile not found.</Alert>
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
              position: "relative",
            }}
          >
            {/* 🖼️ Avatar (Profile Image with Edit Icon) */}
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                mx: "auto",
              }}
            >
              <Avatar
                src={profile.photo ? `${backendBase}/${profile.photo}` : ""}
                alt={profile.firstName || "DM"}
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

              {/* ✏️ Edit Photo Icon (Top-right overlay) */}
              <label
                htmlFor="photo-upload"
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  background: "#2563eb",
                  borderRadius: "50%",
                  width: "38px",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "2px solid white",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#1e40af")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#2563eb")
                }
              >
                <input
                  id="photo-upload"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    Object.keys(form).forEach((key) =>
                      formData.append(key, form[key])
                    );
                    formData.append("photo", file);

                    try {
                      const { data } = await axios.put(
                        "/dm/profile",
                        formData,
                        {
                          headers: { "Content-Type": "multipart/form-data" },
                        }
                      );

                      if (data?.dm?.photo) {
                        setProfile(data.dm);
                        setForm(data.dm);
                        alert("✅ Profile photo updated successfully!");
                      } else {
                        alert(
                          "⚠️ Photo uploaded but no image returned from server."
                        );
                      }
                    } catch (err) {
                      console.error("❌ Photo upload failed:", err);
                      alert("Failed to upload photo. Please try again.");
                    }
                  }}
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="#fff"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm2.92-1.34 8.13-8.13 1.42 1.42-8.13 8.13H5.92zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                </svg>
              </label>
            </Box>

            {/* 🧾 DM Name */}
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              {profile.firstName} {profile.lastName}
            </Typography>

            {/* ✅ Verified Badge */}
            {user?.isVerified && (
              <Tooltip title="Verified DM">
                <VerifiedIcon sx={{ mt: 1, color: "#22c55e", fontSize: 26 }} />
              </Tooltip>
            )}

            {/* ✏️ Edit / Save Profile Buttons */}
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
                textTransform: "uppercase",
                mb: 4,
              }}
            >
              District Magistrate Information
            </Typography>

            <div className="row gy-4 gx-4">
              {/* Unique ID */}
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
                        <VerifiedIcon sx={{ color: "#1e3a8a" }} />
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
                  label="Email Address"
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
                  label="Phone Number"
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

              {/* DOB */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="dob"
                  label="Date of Birth"
                  type="date"
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
                        <LocationOnIcon color="primary" />
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
                        <LocationOnIcon color="primary" />
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
                        <LocationOnIcon color="primary" />
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
                        <LocationOnIcon color="primary" />
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

            {/* Last Updated */}
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
