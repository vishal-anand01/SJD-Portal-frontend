// frontend/src/modules/superadmin/DMManagement/dialogs/ViewDMDialog.jsx
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
  CircularProgress,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';

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
import { deepOrange } from "@mui/material/colors";

import axios from "../../../../../api/axiosConfig";
import dayjs from "dayjs";

import "bootstrap/dist/css/bootstrap.min.css";

export default function ViewDMDialog({ open, onClose, dmId }) {
  const [dm, setDM] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  // 🔥 Fetch DM details
  useEffect(() => {
    if (!open || !dmId) return;

    const load = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/superadmin/dm/${dmId}`);
        setDM(data.dm);
      } catch (err) {
        console.error("❌ DM Fetch Failed:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, dmId]);

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* ⭐ HEADER */}
      <DialogTitle
        sx={{
          background:
            "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)",
          textAlign: "center",
          color: "white",
          fontWeight: 800,
          py: 4,
        }}
      >
        DISTRICT MAGISTRATE DETAILS
      </DialogTitle>

      <DialogContent
        sx={{
          background: "linear-gradient(135deg,#f8fafc,#eff6ff,#dbeafe)",
          py: 4,
        }}
      >
        {loading ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading DM details...</Typography>
          </Box>
        ) : !dm ? (
          <Typography
            sx={{ textAlign: "center", color: "red", fontWeight: 700 }}
          >
            DM not found!
          </Typography>
        ) : (
          <>
            {/* ⭐ AVATAR + NAME */}
            <Box sx={{ textAlign: "center", mb: 4, mt: 4 }}>
              <Avatar
                src={dm.photo ? `${backendBase}/${dm.photo}` : ""}
                alt={dm.firstName}
                sx={{
                  width: 130,
                  height: 130,
                  bgcolor: dm.photo ? "transparent" : deepOrange[500],
                  fontSize: 45,
                  fontWeight: 700,
                  mx: "auto",
                  border: "4px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                {!dm.photo &&
                  (dm.firstName?.[0] || "") + (dm.lastName?.[0] || "")}
              </Avatar>

              <Typography variant="h4" sx={{ mt: 2, fontWeight: 800 }}>
                {dm.firstName} {dm.lastName}
              </Typography>

              <Typography sx={{ opacity: 0.7 }}>DISTRICT MAGISTRATE</Typography>

              {dm.isVerified && (
                <Tooltip title="Verified DM">
                  <VerifiedIcon
                    sx={{ color: "#22c55e", fontSize: 28, mt: 1 }}
                  />
                </Tooltip>
              )}
            </Box>

            {/* ⭐ DETAILS (Bootstrap 2-column layout) */}
            <div className="container">
              <div className="row gy-3">
                {/* Unique ID */}
                <div className="col-md-6">
                  <TextField
                    label="SJD ID"
                    fullWidth
                    value={dm.uniqueId || "-"}
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

                {/* Email */}
                <div className="col-md-6">
                  <TextField
                    label="Email"
                    fullWidth
                    value={dm.email || "-"}
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
                    label="Phone Number"
                    fullWidth
                    value={dm.phone || "-"}
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
                    label="Gender"
                    fullWidth
                    value={dm.gender || "-"}
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
                    label="Date of Birth"
                    fullWidth
                    value={dm.dob ? dayjs(dm.dob).format("DD MMM YYYY") : "-"}
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
                <div className="col-md-6">
                  <TextField
                    label="Designation"
                    fullWidth
                    value={dm.designation || "-"}
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
                <div className="col-md-6">
                  <TextField
                    label="Address"
                    fullWidth
                    value={dm.address || "-"}
                    InputProps={{
                      readOnly: true,
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
                    label="City"
                    fullWidth
                    value={dm.city || "-"}
                    InputProps={{
                      readOnly: true,
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
                    label="District"
                    fullWidth
                    value={dm.district || "-"}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                {/* State */}
                <div className="col-md-6">
                  <TextField
                    label="State"
                    fullWidth
                    value={dm.state || "-"}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                {/* Country */}
                <div className="col-md-6">
                  <TextField
                    label="Country"
                    fullWidth
                    value={dm.country || "-"}
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
                <div className="col-md-6">
                  <TextField
                    label="Pincode"
                    fullWidth
                    value={dm.pincode || "-"}
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
            </div>

            {/* LAST UPDATED */}
            {dm.updatedAt && (
              <Typography
                variant="body2"
                sx={{
                  mt: 4,
                  textAlign: "center",
                  color: "#6b7280",
                  fontStyle: "italic",
                }}
              >
                Last Updated: {dayjs(dm.updatedAt).format("DD MMM YYYY HH:mm")}
              </Typography>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1e3a8a", px: 4 }}
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
