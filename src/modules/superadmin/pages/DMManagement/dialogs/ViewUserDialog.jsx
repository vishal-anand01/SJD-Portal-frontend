// ViewUserDialog.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from "@mui/material";

export default function ViewUserDialog({ open, user, onClose }) {
  if (!user) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>User Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item md={6}><Typography><strong>Name:</strong> {user.firstName} {user.lastName}</Typography></Grid>
          <Grid item md={6}><Typography><strong>Email:</strong> {user.email || "—"}</Typography></Grid>
          <Grid item md={6}><Typography><strong>Role:</strong> {user.role}</Typography></Grid>
          <Grid item md={6}><Typography><strong>District:</strong> {user.district || "—"}</Typography></Grid>
          <Grid item md={6}><Typography><strong>Phone:</strong> {user.phone || "—"}</Typography></Grid>
          <Grid item md={12}><Typography><strong>Address:</strong> {user.address || "—"}</Typography></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
