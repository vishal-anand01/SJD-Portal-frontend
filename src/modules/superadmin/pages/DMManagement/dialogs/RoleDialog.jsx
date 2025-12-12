import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";


export default function RoleDialog({ open, user, onClose, onSubmit }) {
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = () => {
    if (!role) return;
    onSubmit(role);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold", color: "#1e3a8a" }}>
        Change User Role
      </DialogTitle>

      <DialogContent>
        <div className="row">
          <div className="col-12 mt-2">
            <FormControl fullWidth>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={role}
                label="Select Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="officer">Officer</MenuItem>
                <MenuItem value="department">Department</MenuItem>
                <MenuItem value="dm">DM</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="superadmin">SuperAdmin</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </DialogContent>

      <DialogActions className="px-3 pb-3">
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: "#1e3a8a", color: "#1e3a8a" }}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ bgcolor: "#1e3a8a", px: 3 }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
