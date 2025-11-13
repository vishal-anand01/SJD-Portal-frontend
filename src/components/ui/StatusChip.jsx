// Path: frontend/src/components/ui/StatusChip.jsx
import React from "react";
import { Chip } from "@mui/material";

const palette = {
  open: { label: "Open", color: "warning" },
  inprogress: { label: "In Progress", color: "info" },
  closed: { label: "Closed", color: "success" },
  pending: { label: "Pending", color: "default" },
  rejected: { label: "Rejected", color: "error" },
};

const StatusChip = ({ status = "open", variant = "filled" }) => {
  const key = status?.toLowerCase() || "open";
  const p = palette[key] || { label: status, color: "default" };
  return <Chip label={p.label} color={p.color} variant={variant} sx={{ fontWeight: 700 }} />;
};

export default StatusChip;
