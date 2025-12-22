// frontend/src/modules/superadmin/DMManagement/pages/DMViewProfile.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Typography,
  Avatar,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import BusinessIcon from "@mui/icons-material/Business";
import MapIcon from "@mui/icons-material/Map";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PublicIcon from "@mui/icons-material/Public";
import HomeIcon from "@mui/icons-material/Home";
import WcIcon from "@mui/icons-material/Wc";
import PinDropIcon from "@mui/icons-material/PinDrop";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";

import { deepOrange } from "@mui/material/colors";
import axios from "../../../../api/axiosConfig";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

export default function DMViewProfile() {
  const { id } = useParams(); // MongoDB ObjectId

  const [dm, setDM] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  // FETCH DM DETAILS
  useEffect(() => {
    const loadDM = async () => {
      try {
        const { data } = await axios.get(`/superadmin/dm/${id}`);
        setDM(data.dm || null);
        setForm(data.dm || {});
      } catch (err) {
        console.error("❌ DM load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadDM();
    else setLoading(false);
  }, [id]);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files?.[0]) {
      const file = files[0];

      setForm((prev) => ({ ...prev, [name]: file }));

      // 🔥 PREVIEW INSTANT
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // SAVE DM PROFILE
  const handleSave = async () => {
    setSaving(true);

    try {
      const sendData = new FormData();
      // append only keys present in form (including file if set)
      Object.keys(form).forEach((key) => {
        if (form[key] !== undefined && form[key] !== null) {
          sendData.append(key, form[key]);
        }
      });

      const { data } = await axios.put(`/superadmin/dm/${id}`, sendData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDM(data.dm);
      setForm(data.dm);
      setPhotoPreview(""); // ✅ reset
      setEditMode(false);
      // tiny UX: use native alert for now (your previous pattern)
      alert("✅ DM Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Update failed!");
    } finally {
      setSaving(false);
    }
  };

  // DELETE HANDLER (clean & reusable)
  const handleDeleteUser = async () => {
    if (!window.confirm("⚠️ Are you sure? DM will be archived.")) return;

    try {
      await axios.delete(`/superadmin/users/${id}/soft-delete`);
      alert("✅ DM deleted and archived successfully");
      window.location.href = "/superadmin/dm";
    } catch (error) {
      console.error("❌ Delete error:", error);
      alert("❌ Delete failed");
    }
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading DM Profile...</Typography>
      </Box>
    );

  if (!dm)
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">DM not found</Alert>
      </Container>
    );

  const initials =
    (dm.firstName?.[0] || "").toUpperCase() +
    (dm.lastName?.[0] || "").toUpperCase();

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
          {/* HEADER */}
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
            {/* PROFILE PHOTO */}
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={
                  photoPreview
                    ? photoPreview // 🔥 upload ke turant baad
                    : dm.photo
                    ? `${backendBase}/${dm.photo}?t=${Date.now()}`
                    : ""
                }
                sx={{
                  width: 130,
                  height: 130,
                  mb: 2,
                  border: "4px solid white",
                  bgcolor: dm.photo ? "transparent" : deepOrange[500],
                  fontSize: 45,
                  fontWeight: 700,
                }}
              >
                {!dm.photo && initials}
              </Avatar>

              {/* EDIT PHOTO ICON */}
              {editMode && (
                <label
                  htmlFor="dm-photo-edit"
                  style={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    background: "#2563eb",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "2px solid white",
                  }}
                >
                  <input
                    type="file"
                    id="dm-photo-edit"
                    name="photo"
                    accept="image/*"
                    hidden
                    onChange={handleChange}
                  />
                  ✏️
                </label>
              )}
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {dm.firstName} {dm.lastName}
            </Typography>

            {dm.isVerified && (
              <VerifiedIcon sx={{ mt: 1, fontSize: 28, color: "#22c55e" }} />
            )}

            {/* EDIT / SAVE BUTTON */}

            <Box
              sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}
            >
              {!editMode ? (
                <>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#f59e0b", fontWeight: 700 }}
                    onClick={() => setEditMode(true)}
                  >
                    ✏️ Edit Profile
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    sx={{ fontWeight: 700 }}
                    onClick={handleDeleteUser}
                  >
                    🗑️ Delete
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#16a34a", fontWeight: 700 }}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "💾 Save Changes"}
                </Button>
              )}
            </Box>
          </Box>

          {/* BODY */}
          <Box sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                color: "#1e3a8a",
                fontWeight: 800,
                mb: 4,
              }}
            >
              District Magistrate Information
            </Typography>

            <div className="row gy-4 gx-4">
              {/* UNIQUE ID */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  label="SJD ID"
                  name="uniqueId"
                  value={form.uniqueId || ""}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* FIRST NAME */}
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
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* LAST NAME */}
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
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* EMAIL */}
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
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* PHONE */}
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
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Gender */}
              <div className="col-md-6">
                <TextField
                  name="gender"
                  label="Gender"
                  fullWidth
                  value={form.gender || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <WcIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* DOB */}
              <div className="col-md-6">
                <TextField
                  type="date"
                  name="dob"
                  label="Date of Birth"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={form.dob ? dayjs(form.dob).format("YYYY-MM-DD") : ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* DESIGNATION */}
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
                        <WorkIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Address */}
              <div className="col-md-6">
                <TextField
                  name="address"
                  label="Address"
                  fullWidth
                  value={form.address || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode,
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* CITY */}
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
                        <LocationCityIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* DISTRICT */}
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
                        <BusinessIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* STATE */}
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
                        <MapIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* COUNTRY */}
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
                        <PublicIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* PINCODE */}
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
                        <PinDropIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Role (disabled until editMode) */}
              <div className="col-md-6">
                <TextField
                  select
                  fullWidth
                  name="role"
                  label="Role"
                  value={form.role || ""}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                    disabled: !editMode,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  <option value="dm">DM</option>
                  <option value="officer">Officer</option>
                  <option value="department">Department</option>
                  <option value="public">Public</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </TextField>
              </div>
            </div>

            {/* LAST UPDATED */}
            {dm.updatedAt && (
              <Typography
                sx={{
                  mt: 4,
                  textAlign: "center",
                  fontStyle: "italic",
                  color: "#6b7280",
                }}
              >
                Last Updated: {dayjs(dm.updatedAt).format("DD MMM YYYY HH:mm")}
              </Typography>
            )}
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
