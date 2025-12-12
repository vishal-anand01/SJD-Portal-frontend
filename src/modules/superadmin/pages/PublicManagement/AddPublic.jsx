// frontend/src/modules/superadmin/AddPublic.jsx
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
import PinDropIcon from "@mui/icons-material/PinDrop";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import BusinessIcon from "@mui/icons-material/Business";
import MapIcon from "@mui/icons-material/Map";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WcIcon from "@mui/icons-material/Wc";
import axios from "../../../../api/axiosConfig";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

/**
 * AddPublic (final)
 * - Frontend fields mapped to backend User schema
 * - departmentName used instead of department
 * - name (full name) derived before submit
 * - gender is a select with allowed enum values
 * - dob converted to ISO string before sending
 * - file uploaded as `photo`
 */

export default function AddPublic() {
  const navigate = useNavigate();

  // Uttarakhand districts
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

  // role options (matches schema enum)
  const roleOptions = [
    { value: "public", label: "Public" },
    { value: "officer", label: "Officer" },
    { value: "department", label: "Department" },
    { value: "dm", label: "District Magistrate (DM)" },
    { value: "admin", label: "Admin" },
    { value: "superadmin", label: "Superadmin" },
  ];

  // gender options matched to schema enum
  const genderOptions = [
    { value: "", label: "Prefer not to say" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  // form state: keys match the User model
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    // `name` will be derived just prior to submit
    email: "",
    phone: "",
    gender: "", // one of "", "Male", "Female", "Other"
    dob: "",
    designation: "",
    departmentName: "", // <-- IMPORTANT: matches UserSchema.field departmentName
    address: "",
    city: "",
    district: "", // chosen from dropdown
    state: "Uttarakhand",
    country: "India",
    pincode: "",
    role: "public", // matches enum
    password: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // simple input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // photo input
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotoFile(file);
  };

  // submit handler: build payload that matches DB schema
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!form.firstName?.trim() || !form.lastName?.trim() || !form.email?.trim() || !form.password) {
      Swal.fire(
        "Validation",
        "Please fill required fields: First name, Last name, Email and Password.",
        "warning"
      );
      return;
    }

    setSubmitting(true);
    try {
      // assemble payload matching UserSchema fields
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone || "",
        // convert DOB to ISO if present (helps mongoose parse it)
        dob: form.dob ? dayjs(form.dob).toISOString() : null,
        designation: form.designation || "",
        departmentName: form.departmentName || "", // IMPORTANT
        address: form.address || "",
        city: form.city || "",
        district: form.district || "",
        state: form.state || "",
        country: form.country || "",
        pincode: form.pincode || "",
        gender: form.gender || "",
        role: form.role || "public",
        // photo is sent separately (file) when using multipart
      };

      let res;
      if (photoFile) {
        const fd = new FormData();
        // append payload keys (strings/null)
        Object.entries(payload).forEach(([k, v]) => fd.append(k, v ?? ""));
        fd.append("photo", photoFile); // server expects `photo`
        res = await axios.post("/superadmin/public", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // JSON body
        res = await axios.post("/superadmin/public", payload);
      }

      await Swal.fire("Success", "Public user created successfully.", "success");
      navigate("/superadmin/public");
    } catch (err) {
      console.error("Create public user failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to create user. Please try again.";
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
                alt={form.firstName || "User"}
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
                {!photoFile &&
                  (form.firstName?.[0]?.toUpperCase() || "") + (form.lastName?.[0]?.toUpperCase() || "")}
              </Avatar>

              {/* photo upload */}
              <label
                htmlFor="public-photo-upload"
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
                <input id="public-photo-upload" type="file" accept="image/*" hidden onChange={handlePhotoChange} />
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm2.92-1.34 8.13-8.13 1.42 1.42-8.13 8.13H5.92zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                </svg>
              </label>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              ➕ Add Public User
            </Typography>

            <Typography sx={{ mt: 1, opacity: 0.95 }}>
              Create a new user — fill the details below and click Create.
            </Typography>
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

                {/* State (read only Uttarakhand) */}
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
                      readOnly: true,
                    }}
                  />
                </div>

                {/* Country */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    name="country"
                    label="Country"
                    value={form.country}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
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

                {/* Role */}
                <div className="col-md-6">
                  <TextField select fullWidth name="role" label="Role" value={form.role} onChange={handleChange}>
                    {roleOptions.map((r) => (
                      <MenuItem key={r.value} value={r.value}>
                        {r.label}
                      </MenuItem>
                    ))}
                  </TextField>
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
                <div className="col-12 text-center mt-5">
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      backgroundColor: "#16a34a",
                      color: "white",
                      fontWeight: 700,
                      px: 3,
                      "&:hover": { backgroundColor: "#15803d" },
                    }}
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={18} /> : null}
                  >
                    {submitting ? "Creating..." : "Create User"}
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
