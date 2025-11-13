// Path: frontend/src/modules/admin/components/VisitCard.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import StatusChip from "../../../components/ui/StatusChip";

const VisitCard = ({ officer, status, date }) => {
  return (
    <Box
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: 2,
        boxShadow: 1,
        background: "var(--card-bg)",
      }}
    >
      <Typography sx={{ fontWeight: 700 }}>{officer}</Typography>
      <Typography sx={{ fontSize: 13, color: "#6b7280" }}>Scheduled: {date}</Typography>
      <Box sx={{ mt: 1 }}>
        <StatusChip status={status} />
      </Box>
    </Box>
  );
};

export default VisitCard;
