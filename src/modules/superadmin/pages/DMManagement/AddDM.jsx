// frontend/src/modules/superadmin/AddDM.jsx
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
import PersonIcon from "@mui/icons-material/Person";
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

export default function AddDM() {
  const navigate = useNavigate();
  const [photoURL, setPhotoURL] = useState("");

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

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    designation: "District Magistrate",
    address: "",
    city: "",
    district: "",
    state: "Uttarakhand",
    country: "India",
    pincode: "",
    role: "dm",
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

    // basic validation
    if (
      !form.firstName?.trim() ||
      !form.lastName?.trim() ||
      !form.email?.trim() ||
      !form.password
    ) {
      Swal.fire(
        "Validation",
        "Please fill required fields: First name, Last name, Email and Password.",
        "warning"
      );
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (photoFile) {
        const fd = new FormData();
        Object.keys(form).forEach((k) => fd.append(k, form[k] ?? ""));
        fd.append("photo", photoFile);

        res = await axios.post("/superadmin/dm", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("/superadmin/dm", form);
      }

      await Swal.fire(
        "Success",
        "District Magistrate (DM) created successfully.",
        "success"
      );
      navigate("/superadmin/dm");
    } catch (err) {
      console.error("Create DM failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to create DM. Please try again.";
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
              position: "relative",
            }}
          >
            <Box
              sx={{ position: "relative", display: "inline-block", mx: "auto" }}
            >
              <Avatar
                src={
                  photoFile
                    ? URL.createObjectURL(photoFile) // uploaded photo
                    : photoURL
                    ? `${backendBase}/${photoURL}` // DB saved photo
                    : "" // fallback
                }
                alt={form.firstName || "DM"}
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
                  !photoURL &&
                  (form.firstName?.[0]?.toUpperCase() || "") +
                    (form.lastName?.[0]?.toUpperCase() || "")}
              </Avatar>

              <label
                htmlFor="dm-photo-upload"
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
                  id="dm-photo-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhotoChange}
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
              ➕ Add District Magistrate (DM)
            </Typography>

            <Typography sx={{ mt: 1, opacity: 0.95 }}>
              Create a new DM account for the district
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

                {/* Gender */}
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    select
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
                    <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
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

                {/* Designation (default DM) */}
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
                    startIcon={
                      submitting ? <CircularProgress size={18} /> : null
                    }
                  >
                    {submitting ? "Creating..." : "Create DM"}
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
