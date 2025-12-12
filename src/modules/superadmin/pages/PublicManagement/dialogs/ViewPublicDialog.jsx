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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ViewPublicDialog({ open, user, onClose }) {
  // if no user, render a simple dialog so callers that pass `!!user` still work
  const backendBase = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Public User
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {!user ? (
          <Typography color="text.secondary">No user selected.</Typography>
        ) : (
          <>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Avatar
                src={user.photo ? `${backendBase}/${user.photo}` : ""}
                alt={`${user.firstName || ""} ${user.lastName || ""}`}
                sx={{
                  width: 96,
                  height: 96,
                  margin: "0 auto",
                  bgcolor: user.photo ? "transparent" : "#7c3aed",
                  fontSize: 32,
                  fontWeight: 700,
                }}
              >
                {!user.photo &&
                  `${(user.firstName || "").charAt(0)}${(user.lastName || "").charAt(0)}`}
              </Avatar>

              <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
                {`${user.firstName || ""} ${user.lastName || ""}`.trim() || "—"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {user.uniqueId || "—"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography>{user.email || "—"}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                <Typography>{user.phone || "—"}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">District</Typography>
                <Typography>{user.district || "—"}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                <Typography sx={{ whiteSpace: "pre-wrap" }}>{user.address || "—"}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Joined</Typography>
                <Typography>
                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
                </Typography>
              </Box>
            </Stack>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
