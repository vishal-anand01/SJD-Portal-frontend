// Path: frontend/src/components/ui/EmptyState.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const EmptyState = ({ title = "No items", subtitle = "Nothing to show here yet.", primaryAction }) => {
  return (
    <Box sx={{ textAlign: "center", py: 6 }}>
      <InsertDriveFileIcon sx={{ fontSize: 64, opacity: 0.15 }} />
      <Typography sx={{ fontWeight: 800, mt: 2 }}>{title}</Typography>
      <Typography sx={{ color: "#6b7280", mt: 1 }}>{subtitle}</Typography>
      {primaryAction && (
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={primaryAction.onClick}>
            {primaryAction.label}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EmptyState;
