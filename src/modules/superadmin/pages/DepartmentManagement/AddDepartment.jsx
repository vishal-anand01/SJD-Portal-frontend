// frontend/src/modules/superadmin/AddDepartment.jsx
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
import BusinessIcon from "@mui/icons-material/Business";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MapIcon from "@mui/icons-material/Map";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import axios from "../../../../api/axiosConfig";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function AddDepartment() {
  const navigate = useNavigate();

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

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

  // UI state (labels kept). We'll map these to User schema keys before sending.
  const [form, setForm] = useState({
    departmentName: "",
    departmentCode: "",
    description: "",
    headFirstName: "",
    headLastName: "",
    headDesignation: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    district: "",
    state: "Uttarakhand",
    country: "India",
    pincode: "",
    password: "",
    // role is fixed to "department" when sending payload
  });

  const [logoFile, setLogoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setLogoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required checks: departmentName, head first/last, email, password
    if (
      !form.departmentName?.trim() ||
      !form.headFirstName?.trim() ||
      !form.headLastName?.trim() ||
      !form.email?.trim() ||
      !form.password
    ) {
      Swal.fire(
        "Validation",
        "Please provide Department name, Head's First & Last name, Email and Password.",
        "warning"
      );
      return;
    }

    setSubmitting(true);

    try {
      // Map UI fields -> User schema payload
      const payload = {
        firstName: form.headFirstName.trim(),
        lastName: form.headLastName.trim(),
        name: `${form.headFirstName.trim()} ${form.headLastName.trim()}`.trim(),
        email: form.email.trim(),
        password: form.password,
        designation: form.headDesignation || "",
        departmentName: form.departmentName || "", // department stored on head user
        phone: form.phone || "",
        dob: form.dob ? dayjs(form.dob).toISOString() : null,
        address: form.address || "",
        city: form.city || "",
        district: form.district || "",
        state: form.state || "",
        country: form.country || "",
        pincode: form.pincode || "",
        gender: form.gender || "",
        role: "department", // fixed role
      };

      let res;
      if (logoFile) {
        // multipart (FormData) because of logo
        const fd = new FormData();
        // append mapped payload
        Object.entries(payload).forEach(([k, v]) => fd.append(k, v ?? ""));
        // append UI extras — backend may ignore them if not expecting
        if (form.departmentCode)
          fd.append("departmentCode", form.departmentCode);
        if (form.description) fd.append("description", form.description);
        // logo/photo should be field "photo" as per User schema usage in other modules
        fd.append("photo", logoFile);

        res = await axios.post("/superadmin/departments", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // JSON body; include extras as well (server may ignore extras)
        const jsonBody = { ...payload };
        if (form.departmentCode) jsonBody.departmentCode = form.departmentCode;
        if (form.description) jsonBody.description = form.description;

        res = await axios.post("/superadmin/departments", jsonBody);
      }

      await Swal.fire(
        "Success",
        "Department (and head user) created successfully.",
        "success"
      );
      navigate("/superadmin/departments");
    } catch (err) {
      console.error("Create department failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to create department. Please try again.";
      Swal.fire("Error", msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

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
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(6px)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background:
                "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)",
              py: 5,
              textAlign: "center",
              color: "white",
            }}
          >
            <Box
              sx={{ position: "relative", display: "inline-block", mx: "auto" }}
            >
              <Avatar
                src={
                  logoFile
                    ? URL.createObjectURL(logoFile)
                    : form.photo
                    ? `${backendBase}/${form.photo}`
                    : ""
                }
                alt={form.departmentName || "Department"}
                sx={{
                  width: 130,
                  height: 130,
                  mb: 2,
                  border: "4px solid white",
                  bgcolor: logoFile ? "transparent" : deepOrange[500],
                  fontSize: 45,
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                {!logoFile && (form.departmentName?.[0]?.toUpperCase() || "D")}
              </Avatar>

              <label
                htmlFor="department-logo-upload"
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
                  id="department-logo-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleLogoChange}
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

            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              ➕ Add Department
            </Typography>
            <Typography sx={{ mt: 1, opacity: 0.95 }}>
              Create a new department account (and head user)
            </Typography>
          </Box>

          {/* Body */}
          <Box sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
            <form onSubmit={handleSubmit}>
              <div className="row gy-4 gx-4">
                {/* Department Name */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    required
                    name="departmentName"
                    label="Department Name"
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

                {/* Department Code (optional) */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    name="departmentCode"
                    label="Department Code (optional)"
                    value={form.departmentCode}
                    onChange={handleChange}
                  />
                </div>

                {/* Head First Name */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    required
                    name="headFirstName"
                    label="Head First Name"
                    value={form.headFirstName}
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

                {/* Head Last Name */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    required
                    name="headLastName"
                    label="Head Last Name"
                    value={form.headLastName}
                    onChange={handleChange}
                  />
                </div>

                {/* Head Designation */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    name="headDesignation"
                    label="Head Designation"
                    value={form.headDesignation}
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

                {/* Email */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    required
                    name="email"
                    label="Head Email Address"
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

                {/* DOB */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    name="dob"
                    label="Date of Birth (Head)"
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

                {/* Description */}
                <div className="col-md-12">
                  <TextField
                    fullWidth
                    name="description"
                    label="Description"
                    value={form.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                  />
                </div>

                {/* Gender */}
                <div className="col-md-6">
                  <TextField
                    select
                    fullWidth
                    name="gender"
                    label="Head Gender"
                    value={form.gender}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
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

                {/* Password */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    required
                    name="password"
                    label="Password (for head account)"
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
                    startIcon={
                      submitting ? <CircularProgress size={18} /> : null
                    }
                  >
                    {submitting ? "Creating..." : "Create Department"}
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
