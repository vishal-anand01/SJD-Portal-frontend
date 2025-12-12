// src/modules/superadmin/pages/DepartmentManagement/dialogs/ViewDepartmentDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Typography,
  Grid,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

export default function ViewDepartmentDialog({ open, department, onClose }) {
  if (!department) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Department
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            No department selected.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const {
    _id,
    name,
    code,
    logo,
    email,
    phone,
    district,
    address,
    description,
    createdAt,
  } = department;

  // backend uploads base used in other components — keep same env var so images load correctly
  const backendBase = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          <Avatar
            src={logo ? `${backendBase}/${logo}` : ""}
            sx={{ width: 56, height: 56, bgcolor: !logo ? "#7c3aed" : "transparent", fontSize: 20 }}
            alt={name || "Department"}
          >
            {!logo && (name ? name.charAt(0).toUpperCase() : "D")}
          </Avatar>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {name || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {code ? `Code: ${code}` : "No code"}
            </Typography>
          </Box>
        </Box>

        <IconButton
          aria-label="edit"
          size="small"
          onClick={() => (window.location.href = `/superadmin/department/edit/${_id}`)}
        >
          <EditIcon />
        </IconButton>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ ml: 1 }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Email
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>{email || "—"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Phone
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>{phone || "—"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              District
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>{district || "—"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Created
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {createdAt ? new Date(createdAt).toLocaleString() : "—"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Address
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>{address || "—"}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
              Description
            </Typography>
            <Typography sx={{ whiteSpace: "pre-wrap" }}>{description || "—"}</Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={() => (window.location.href = `/superadmin/department/edit/${_id}`)}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
