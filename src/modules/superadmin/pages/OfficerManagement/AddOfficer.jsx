// frontend/src/modules/superadmin/AddOfficer.jsx
import React, { useState } from "react";
import {
  Container,
  Card,
  Typography,
  Avatar,
  Box,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import BusinessIcon from "@mui/icons-material/Business";
import MapIcon from "@mui/icons-material/Map";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WcIcon from "@mui/icons-material/Wc";
import PinDropIcon from "@mui/icons-material/PinDrop";
import axios from "../../../../api/axiosConfig";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

/**
 * AddOfficer (final)
 * - UI labels user-friendly
 * - Submitted keys match User schema:
 *   firstName, lastName, name, email, password, phone, dob, designation,
 *   departmentName, address, city, district, state, country, pincode, gender, role, photo
 * - role is fixed to "officer" (no role select in form)
 * - Endpoint: POST /superadmin/officers (multipart if photo)
 */

export default function AddOfficer() {
  const navigate = useNavigate();

  const ukDistricts = [
    "Almora",
    "Bageshwar",
    "Chamoli",
    "Champawat",
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh",
    "Rudraprayag",
    "Tehri Garhwal",
    "Udham Singh Nagar",
    "Uttarkashi",
  ];

  const genderOptions = [
    { value: "", label: "Prefer not to say" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  // form state uses keys matching User schema (departmentName not department, etc.)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    // name will be derived before submit
    email: "",
    phone: "",
    gender: "", // "", "Male", "Female", "Other"
    dob: "",
    designation: "",
    departmentName: "", // matches UserSchema
    address: "",
    city: "",
    district: "",
    state: "Uttarakhand",
    country: "India",
    pincode: "",
    password: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation (required fields)
    if (!form.firstName?.trim() || !form.lastName?.trim() || !form.email?.trim() || !form.password) {
      Swal.fire("Validation", "Please fill required: First name, Last name, Email and Password.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      // Build payload that matches User schema
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone || "",
        dob: form.dob || null,
        designation: form.designation || "",
        departmentName: form.departmentName || "",
        address: form.address || "",
        city: form.city || "",
        district: form.district || "",
        state: form.state || "",
        country: form.country || "",
        pincode: form.pincode || "",
        gender: form.gender || "",
        role: "officer", // FIXED
      };

      let res;
      if (photoFile) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => fd.append(k, v ?? ""));
        fd.append("photo", photoFile);

        res = await axios.post("/superadmin/officers", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("/superadmin/officers", payload);
      }

      await Swal.fire("Success", "Officer created successfully.", "success");
      navigate("/superadmin/officers");
    } catch (err) {
      console.error("Create officer failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to create officer. Please try again.";
      Swal.fire("Error", msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #dbeafe 100%)",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            overflow: "hidden",
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(6px)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)",
              py: 5,
              textAlign: "center",
              color: "white",
              position: "relative",
            }}
          >
            <Box sx={{ position: "relative", display: "inline-block", mx: "auto" }}>
              <Avatar
                src={photoFile ? URL.createObjectURL(photoFile) : ""}
                alt={form.firstName || "Officer"}
                sx={{
                  width: 130,
                  height: 130,
                  mb: 2,
                  border: "4px solid white",
                  bgcolor: photoFile ? "transparent" : deepOrange[500],
                  fontSize: 45,
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                {!photoFile && (form.firstName?.[0]?.toUpperCase() || "")}
              </Avatar>

              <label
                htmlFor="officer-photo-upload"
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
                <input id="officer-photo-upload" type="file" accept="image/*" hidden onChange={handlePhotoChange} />
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm2.92-1.34 8.13-8.13 1.42 1.42-8.13 8.13H5.92zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                </svg>
              </label>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              ➕ Add Officer
            </Typography>

            <Typography sx={{ mt: 1, opacity: 0.95 }}>Create a new officer account</Typography>
          </Box>

          {/* Body */}
          <Box sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
            <form onSubmit={handleSubmit}>
              <div className="row gy-4 gx-4">
                {/* First Name */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    required
                    name="firstName"
                    label="First Name"
                    value={form.firstName}
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

                {/* Last Name */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    required
                    name="lastName"
                    label="Last Name"
                    value={form.lastName}
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

                {/* Email */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    required
                    name="email"
                    label="Email Address"
                    type="email"
                    value={form.email}
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

                {/* Phone */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    value={form.phone}
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

                {/* Gender (select matching schema enum) */}
                <div className="col-md-6">
                  <TextField
                    select
                    fullWidth
                    name="gender"
                    label="Gender"
                    value={form.gender}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WcIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {genderOptions.map((g) => (
                      <MenuItem key={g.value} value={g.value}>
                        {g.label}
                      </MenuItem>
                    ))}
                  </TextField>
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
                    value={form.designation}
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

                {/* DepartmentName (matches DB) */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    name="departmentName"
                    label="Department"
                    value={form.departmentName}
                    onChange={handleChange}
                    InputProps={{
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
                    value={form.address}
                    onChange={handleChange}
                    InputProps={{
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
                    value={form.city}
                    onChange={handleChange}
                    InputProps={{
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
                    select
                    fullWidth
                    name="district"
                    label="District"
                    value={form.district}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="">
                      <em>Choose District</em>
                    </MenuItem>
                    {ukDistricts.map((d) => (
                      <MenuItem key={d} value={d}>
                        {d}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                {/* State */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    name="state"
                    label="State"
                    value={form.state}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ shrink: true }}
                    readOnly
                  />
                </div>

                {/* Pincode */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    name="pincode"
                    label="Pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PinDropIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                {/* Password */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    required
                    name="password"
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                {/* Submit */}
                <div className="col-12 text-end mt-3">
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      backgroundColor: "#1e3a8a",
                      color: "white",
                      fontWeight: 700,
                      px: 3,
                      "&:hover": { backgroundColor: "#163163" },
                    }}
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={18} /> : null}
                  >
                    {submitting ? "Creating..." : "Create Officer"}
                  </Button>
                </div>
              </div>
            </form>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
