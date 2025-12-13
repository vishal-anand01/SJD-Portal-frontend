import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WcIcon from "@mui/icons-material/Wc";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MapIcon from "@mui/icons-material/Map";
import PublicIcon from "@mui/icons-material/Public";
import HomeIcon from "@mui/icons-material/Home";
import VerifiedIcon from "@mui/icons-material/Verified";
import PinDropIcon from "@mui/icons-material/PinDrop";
import WorkIcon from "@mui/icons-material/Work";

import { deepOrange } from "@mui/material/colors";
import axios from "../../../../../api/axiosConfig";
import dayjs from "dayjs";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EditDMDialog({ open, onClose, dmId, refreshList }) {
  const [dm, setDM] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  // 🔥 Fetch DM When Dialog Opens
  useEffect(() => {
    if (!open || !dmId) return;

    const fetchDM = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/superadmin/dm/${dmId}`);
        setDM(data.dm);
        setForm(data.dm);
      } catch (err) {
        console.error("❌ Failed to load DM details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDM();
  }, [open, dmId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ⭐ Save Updated DM
  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      Object.keys(form).forEach((key) => formData.append(key, form[key]));

      const { data } = await axios.put(`/superadmin/dm/${dmId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ DM Updated Successfully!");

      refreshList(); // reload list
      onClose();
    } catch (err) {
      console.error("❌ DM update failed:", err);
      alert("Failed to update DM.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* HEADER */}
      <DialogTitle
        sx={{
          background: "linear-gradient(90deg,#1e3a8a,#2563eb,#38bdf8)",
          color: "white",
          textAlign: "center",
          fontWeight: 800,
          py: 3,
        }}
      >
        ✏️ Edit District Magistrate
      </DialogTitle>

      <DialogContent
        sx={{
          background: "linear-gradient(135deg,#f8fafc,#eff6ff,#dbeafe)",
          py: 4,
        }}
      >
        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading DM details...</Typography>
          </Box>
        ) : (
          <>
            {/* AVATAR WITH EDIT OPTION */}

            <Box
              sx={{ textAlign: "center", mt: 4, mb: 4, position: "relative" }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                  mx: "auto",
                }}
              >
                <Avatar
                  src={form.photo ? `${backendBase}/${form.photo}` : ""}
                  alt={form.firstName}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                    border: "4px solid white",
                    bgcolor: form.photo ? "transparent" : deepOrange[500],
                    fontSize: 40,
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                >
                  {!form.photo &&
                    (form.firstName?.[0] || "") + (form.lastName?.[0] || "")}
                </Avatar>

                {/* ⭐ Correctly Positioned Pencil Icon */}
                <label
                  htmlFor="dm-photo-upload-edit"
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
                >
                  <input
                    id="dm-photo-upload-edit"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setForm({ ...form, photo: file });
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

              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {form.firstName} {form.lastName}
              </Typography>
            </Box>

            {/* FORM GRID SAME AS DM PROFILE */}
            <div className="row gy-3 gx-3">
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
                        <VerifiedIcon color="primary" />
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* GENDER */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="gender"
                  label="Gender"
                  value={form.gender || ""}
                  onChange={handleChange}
                  InputProps={{
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
                  type="date"
                  name="dob"
                  label="Date of Birth"
                  value={form.dob ? dayjs(form.dob).format("YYYY-MM-DD") : ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon color="primary" />
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon color="primary" />
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
                />
              </div>

              {/* ROLE */}
              <div className="col-md-6">
                <TextField
                  select
                  fullWidth
                  name="role"
                  label="Role"
                  value={form.role || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VerifiedIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="dm">District Magistrate</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="officer">Officer</MenuItem>
                  <MenuItem value="department">Department User</MenuItem>
                  <MenuItem value="public">Public User</MenuItem>
                  <MenuItem value="superadmin">Super Admin</MenuItem>
                </TextField>
              </div>
            </div>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1e3a8a" }}
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? "Saving..." : "💾 Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
