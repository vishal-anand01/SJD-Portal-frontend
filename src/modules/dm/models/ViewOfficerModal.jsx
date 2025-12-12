import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Divider,
  Box,
  Paper,
  TextField,
  InputAdornment,
  Avatar,
  Tooltip,
} from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PublicIcon from "@mui/icons-material/Public";
import VerifiedIcon from "@mui/icons-material/Verified";
import WcIcon from "@mui/icons-material/Wc";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PinDropIcon from "@mui/icons-material/PinDrop";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import { deepOrange } from "@mui/material/colors";
import dayjs from "dayjs";

export default function ViewOfficerModal({ open, onClose, officer }) {
  if (!officer) return null;

  const backendBase = "http://localhost:5000/uploads";

  const initials = officer.firstName
    ? `${officer.firstName[0]}${officer.lastName ? officer.lastName[0] : ""}`
    : "O";

  // safer for numbers/nulls
  const fieldValue = (v) => {
    if (v === null || v === undefined) return "—";
    const s = String(v).trim();
    return s && s !== "null" && s !== "undefined" ? s : "—";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          background:
            "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)",
          color: "white",
          textAlign: "center",
          fontWeight: 800,
          py: 3,
        }}
      >
        Officer Profile
      </DialogTitle>

      <DialogContent sx={{ py: 5 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            overflow: "hidden",
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
            p: 4,
          }}
        >
          {/* MAIN DETAILS (Bootstrap grid) */}
          <Typography
            variant="h6"
            className="text-center"
            sx={{
              color: "#1e3a8a",
              fontWeight: 800,
              textTransform: "uppercase",
              mb: 4,
            }}
          >
            Officer Information
          </Typography>

          <div className="row g-3">
            {/* Unique SJD ID */}
            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="SJD ID"
                value={fieldValue(officer.uniqueId)}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <VerifiedIcon color="success" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            {/* Full Name */}
            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="Full Name"
                value={`${officer.firstName || ""} ${
                  officer.lastName || ""
                }`.trim()}
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
            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="Email Address"
                value={fieldValue(officer.email)}
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
            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="Phone Number"
                value={fieldValue(officer.phone)}
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
            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="Gender"
                value={fieldValue(officer.gender)}
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
            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="Date of Birth"
                value={
                  officer.dob ? dayjs(officer.dob).format("DD MMM YYYY") : "—"
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

            {/* Designation */}
            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="Designation"
                value={fieldValue(officer.designation)}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            {/* Address */}
            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="Address"
                value={
                  officer.address
                    ? `${officer.address}, ${officer.city || ""}, ${
                        officer.district || ""
                      }, ${officer.state || ""}`
                    : "—"
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

            {/* Country */}
            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="Country"
                value={fieldValue(officer.country)}
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

            {/* Pincode */}
            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="Pincode"
                value={fieldValue(officer.pincode)}
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
          </div>

          {/* FOOTER DETAILS */}
          <Divider sx={{ my: 4 }} />

          <div className="row g-3">
            {/* Joined On */}
            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="Register On Portal"
                value={
                  officer.createdAt
                    ? dayjs(officer.createdAt).format("DD MMM YYYY")
                    : "—"
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

            {/* Last Active */}
            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="Last Active"
                value={
                  officer.lastActiveAt
                    ? dayjs(officer.lastActiveAt).format("DD MMM YYYY HH:mm")
                    : "—"
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
        </Paper>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: "#1e3a8a",
            px: 5,
            fontWeight: 700,
            borderRadius: 3,
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
