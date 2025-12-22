// src/modules/superadmin/pages/DepartmentManagement/DepartmentViewProfile.jsx
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
import PublicIcon from "@mui/icons-material/Public";
import HomeIcon from "@mui/icons-material/Home";
import PinDropIcon from "@mui/icons-material/PinDrop";
import WorkIcon from "@mui/icons-material/Work";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WcIcon from "@mui/icons-material/Wc";

import { deepOrange } from "@mui/material/colors";
import axios from "../../../../api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function DepartmentViewProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dept, setDept] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  /* ================= FETCH ================= */
  useEffect(() => {
    const loadDept = async () => {
      try {
        const { data } = await axios.get(`/superadmin/departments/users/${id}`);
        setDept(data.department);
        setForm(data.department);
      } catch (err) {
        console.error("Department load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadDept();
  }, [id]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files[0]) {
      setForm((p) => ({ ...p, [name]: files[0] }));
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));

      const { data } = await axios.put(
        `/superadmin/departments/users/${id}`,
        fd
      );

      setDept(data.depUser);
      setForm(data.depUser);
      setPhotoPreview("");
      setEditMode(false);
      alert("✅ Department updated");
    } catch {
      alert("❌ Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!window.confirm("⚠️ Department will be archived. Continue?")) return;
    await axios.delete(`/superadmin/users/${id}/soft-delete`);
    alert("✅ Department archived");
    navigate("/superadmin/departments");
  };


  if (loading)
    return (
      <Box textAlign="center" py={10}>
        <CircularProgress />
      </Box>
    );

  if (!dept)
    return (
      <Container>
        <Alert severity="error">Department not found</Alert>
      </Container>
    );

  const initials = dept.departmentName?.[0]?.toUpperCase() || "D";

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
        {/* ================= HEADER ================= */}
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
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              src={
                photoPreview
                  ? photoPreview
                  : dept.photo
                  ? `${backendBase}/${dept.photo}?t=${Date.now()}`
                  : ""
              }
              sx={{
                width: 130,
                height: 130,
                mb: 2,
                border: "4px solid white",
                bgcolor: dept.logo ? "transparent" : deepOrange[500],
                fontSize: 45,
                fontWeight: 700,
              }}
            >
              {!dept.logo && initials}
            </Avatar>

            {editMode && (
              <label
                htmlFor="dept-logo-edit"
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
                  id="dept-logo-edit"
                  name="logo"
                  accept="image/*"
                  hidden
                  onChange={handleChange}
                />
                ✏️
              </label>
            )}
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {dept.name}
          </Typography>

          {dept.isVerified && (
            <VerifiedIcon sx={{ mt: 1, fontSize: 28, color: "#22c55e" }} />
          )}

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
                  onClick={async () => {
                    if (!window.confirm("⚠️ Are you sure?")) return;
                    try {
                      await axios.delete(
                        `/superadmin/departments/users/${id}/soft-delete`
                      );
                      alert("✅ Department archived");
                      window.location.href = "/superadmin/departments";
                    } catch {
                      alert("❌ Delete failed");
                    }
                  }}
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

        {/* ================= BODY ================= */}
        <Box p={4}>
          <div className="row g-3">
            {/* SJD ID */}
            <div className="col-md-6">
              <TextField
                fullWidth
                label="SJD ID"
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
                      <PersonIcon />
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
                InputProps={{ readOnly: !editMode }}
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
                      <EmailIcon />
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
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            {/* DOB */}
            <div className="col-md-6">
              <TextField
                type="date"
                fullWidth
                name="dob"
                label="Date of Birth"
                value={form.dob ? dayjs(form.dob).format("YYYY-MM-DD") : ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
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
                      <WcIcon />
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
                      <WorkIcon />
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
                      <BusinessIcon />
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
                      <HomeIcon />
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
                InputProps={{ readOnly: !editMode }}
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
                InputProps={{ readOnly: !editMode }}
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
                InputProps={{ readOnly: !editMode }}
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
                InputProps={{ readOnly: !editMode }}
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
                      <PinDropIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          {/* LAST UPDATED */}
          {dept.updatedAt && (
            <Typography
              align="center"
              sx={{ mt: 4, fontStyle: "italic", color: "#6b7280" }}
            >
              Last Updated: {dayjs(dept.updatedAt).format("DD MMM YYYY HH:mm")}
            </Typography>
          )}
        </Box>
      </Card>
    </Container>
  );
}
