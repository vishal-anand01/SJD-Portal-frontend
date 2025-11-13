import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PublicDashboard() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg,#f8fafc 0%,#e2e8f0 100%)",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: "#1e3a8a" }}>
        👋 Welcome to SJD-Portal
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: "600px", textAlign: "center", mb: 3 }}>
        This is your citizen dashboard where you can register complaints, view progress,
        and connect with departments in real-time.
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#1e3a8a",
          "&:hover": { backgroundColor: "#1d4ed8" },
          borderRadius: "8px",
          px: 4,
          py: 1.2,
        }}
        onClick={() => navigate("/track")}
      >
        📄 Track Complaints
      </Button>
    </Box>
  );
}
