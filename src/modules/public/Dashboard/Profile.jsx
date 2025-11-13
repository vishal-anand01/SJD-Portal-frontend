import React, { useContext } from "react";
import {
  Container,
  Card,
  Typography,
  Avatar,
  Button,
  Divider,
  Box,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import AuthContext from "../../../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PublicIcon from "@mui/icons-material/Public";
import VerifiedIcon from "@mui/icons-material/Verified";
import WcIcon from "@mui/icons-material/Wc";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PinDropIcon from "@mui/icons-material/PinDrop";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const { user } = useContext(AuthContext);

  const initials =
    user?.firstName || user?.name
      ? (user.firstName || user.name)
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #dbeafe 100%)",
        minHeight: "100vh",
        py: 5,
      }}
    >
      <Container maxWidth="lg">
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
            <Avatar
              src={user?.avatar || ""}
              alt={user?.firstName || "User"}
              sx={{
                width: 130,
                height: 130,
                mx: "auto",
                mb: 2,
                border: "4px solid white",
                bgcolor: user?.avatar ? "transparent" : deepOrange[500],
                fontSize: 45,
                fontWeight: 700,
              }}
            >
              {!user?.avatar && initials}
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {user?.firstName
                ? `${user.firstName} ${user?.lastName || ""}`
                : user?.name || "Guest User"}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {user?.role?.toUpperCase() || "PUBLIC USER"}
            </Typography>

            {user?.isVerified && (
              <Tooltip title="Verified Account">
                <VerifiedIcon sx={{ mt: 1, color: "#22c55e", fontSize: 26 }} />
              </Tooltip>
            )}
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
              Personal Information
            </Typography>

            {/* 🧾 Bootstrap Grid */}
            <div className="row gy-4 gx-4">
              {/* Full Name */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  label="Full Name"
                  value={
                    user?.firstName
                      ? `${user.firstName} ${user?.lastName || ""}`
                      : "N/A"
                  }
                  InputProps={{
                    readOnly: true,
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
                  label="Email Address"
                  value={user?.email || "N/A"}
                  InputProps={{
                    readOnly: true,
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
                  label="Phone Number"
                  value={user?.phone || "Not Provided"}
                  InputProps={{
                    readOnly: true,
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
                  label="Gender"
                  value={user?.gender || "Not Specified"}
                  InputProps={{
                    readOnly: true,
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
                  label="Date of Birth"
                  value={
                    user?.dob
                      ? new Date(user.dob).toLocaleDateString()
                      : "Not Provided"
                  }
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Country */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  label="Country"
                  value={user?.country || "Not Provided"}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PublicIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Address */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  label="Address"
                  value={
                    user?.address
                      ? `${user.address}, ${user?.city || ""}, ${user?.state || ""}`
                      : "Not Provided"
                  }
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Pincode */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  label="Pincode"
                  value={user?.pincode || "Not Provided"}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PinDropIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Member Since */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  label="Member Since"
                  value={
                    user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"
                  }
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Last Active */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  label="Last Active"
                  value={
                    user?.lastActiveAt
                      ? new Date(user.lastActiveAt).toLocaleString()
                      : "N/A"
                  }
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
