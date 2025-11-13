// Path: frontend/src/modules/superadmin/components/SystemStats.jsx
import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

const stats = [
  { label: "Total Users", value: 523 },
  { label: "Active Departments", value: 15 },
  { label: "Monthly Reports", value: 74 },
  { label: "Complaints Processed", value: 1243 },
];

const SystemStats = () => {
  return (
    <Grid container spacing={2}>
      {stats.map((s, i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#2e6df6" }}>
              {s.value}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              {s.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default SystemStats;
