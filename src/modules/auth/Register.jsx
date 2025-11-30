import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Divider,
  MenuItem,
  Select,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Home,
  LocationCity,
  Public,
  Lock,
  Visibility,
  VisibilityOff,
  CalendarMonth,
  PinDrop,
} from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LayersIcon from "@mui/icons-material/Layers";
import { Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (form.password !== form.confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (error) {
      setErr(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const DISTRICTS = [
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

  return (
    <>
      {/* 🌟 HERO SECTION */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)",
          color: "#fff",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Create <span style={{ color: "#fbbf24" }}>Your Account</span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: "700px",
              mx: "auto",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            नागरिकों और अधिकारियों के लिए एकीकृत प्लेटफॉर्म — नया खाता बनाएँ और
            SJD-Portal से जुड़ें।
          </Typography>
        </Container>
      </Box>

      {/* 🟦 REGISTER FORM SECTION */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
          py: 6,
        }}
      >
        <Container>
          <Card
            sx={{
              borderRadius: "16px",
              p: { xs: 3, md: 5 },
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
              maxWidth: "950px",
              mx: "auto",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                mb: 3,
                textAlign: "center",
                color: "#1e3a8a",
              }}
            >
              Register to SJD-Portal
            </Typography>

            <form onSubmit={handleSubmit}>
              <Row className="gy-3">
                {/* First & Last Name */}
                <Col md={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="Enter your first name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
                <Col md={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="Enter your last name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                {/* Gender */}
                <Col md={12}>
                  <FormLabel
                    component="legend"
                    sx={{ color: "#1e3a8a", fontWeight: 600 }}
                  >
                    Gender
                  </FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    sx={{ mt: 1 }}
                  >
                    <FormControlLabel
                      value="Male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="Female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="Other"
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                </Col>

                {/* Email & Phone */}
                <Col md={6}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="example@email.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
                <Col md={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="+91 9876543210"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                {/* DOB & Address */}
                <Col md={6}>
                  <TextField
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
                <Col md={6}>
                  <TextField
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="House No, Street, Locality"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Home />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                {/* City & State */}
                <Col md={6}>
                  <TextField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="Enter your city"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCity />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                <Col md={6}>
                  <Select
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    fullWidth
                    required
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <LayersIcon />
                      </InputAdornment>
                    }
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  >
                    <MenuItem value="" disabled>
                      Select District
                    </MenuItem>

                    {DISTRICTS.map((dist) => (
                      <MenuItem key={dist} value={dist}>
                        {dist}
                      </MenuItem>
                    ))}
                  </Select>
                </Col>

                <Col md={6}>
                  <TextField
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="Enter your state"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountBalanceIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                {/* Country & Pincode */}
                <Col md={6}>
                  <TextField
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="Enter your country"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Public />
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
                    required
                    placeholder="Enter your area pincode"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PinDrop />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                <Divider sx={{ my: 3, width: "100%" }} />

                {/* Password & Confirm Password */}
                <Col md={6}>
                  <TextField
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="Enter password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
                <Col md={6}>
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="Re-enter password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirm(!showConfirm)}
                          >
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>

                {/* Error */}
                {err && (
                  <Col md={12}>
                    <Box
                      sx={{
                        backgroundColor: "#fee2e2",
                        border: "1px solid #f87171",
                        borderRadius: "8px",
                        p: 1.5,
                        color: "#b91c1c",
                        fontSize: "0.9rem",
                      }}
                    >
                      ⚠️ {err}
                    </Box>
                  </Col>
                )}

                {/* Submit */}
                <Col md={12} className="text-center mt-3">
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{
                      backgroundColor: "#1e3a8a",
                      "&:hover": { backgroundColor: "#1d4ed8" },
                      borderRadius: "8px",
                      fontWeight: 700,
                      px: 5,
                      py: 1.2,
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress
                          size={20}
                          sx={{ color: "#fff", mr: 1 }}
                        />
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </Col>
              </Row>
            </form>

            {/* Footer Redirect */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#475569" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#1e3a8a", fontWeight: 600 }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  );
}
