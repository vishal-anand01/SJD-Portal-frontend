import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Stack,
  Divider,
} from "@mui/material";

export default function ViewOfficerDialog({ open, onClose, officer }) {
  if (!officer) return null;

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  const fullName = `${officer.firstName || ""} ${officer.lastName || ""}`.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Officer Details</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ textAlign: "center", mt: 1, mb: 3 }}>
          <Avatar
            src={officer.photo ? `${backendBase}/${officer.photo}` : ""}
            sx={{
              width: 100,
              height: 100,
              margin: "auto",
              bgcolor: officer.photo ? "transparent" : "#7c3aed",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            {!officer.photo &&
              `${(officer.firstName || "").charAt(0)}${(officer.lastName || "").charAt(0)}`}
          </Avatar>

          <Typography variant="h5" sx={{ mt: 2, fontWeight: 700 }}>
            {fullName || "N/A"}
          </Typography>

          <Typography variant="body2" sx={{ color: "gray" }}>
            {officer.uniqueId || "—"}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>District</Typography>
            <Typography>{officer.district || "—"}</Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700 }}>Email</Typography>
            <Typography>{officer.email || "—"}</Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700 }}>Phone</Typography>
            <Typography>{officer.phone || "—"}</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography sx={{ fontWeight: 700 }}>Account Created</Typography>
            <Typography>
              {officer.createdAt
                ? new Date(officer.createdAt).toLocaleString()
                : "—"}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
