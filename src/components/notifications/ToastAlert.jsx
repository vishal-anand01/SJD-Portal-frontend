import React from "react";
import { Snackbar, Alert } from "@mui/material";

export default function ToastAlert({ open, message, severity = "info", onClose, autoHideDuration = 3000 }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          fontWeight: 600,
          borderRadius: "8px",
          boxShadow: "0px 3px 10px rgba(0,0,0,0.15)",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
