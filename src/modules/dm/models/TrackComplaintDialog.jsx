import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import TrackStatus from "../pages/TrackStatus";
import axios from "../../../api/axiosConfig";

export default function TrackComplaintDialog({ open, onClose, trackingId }) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trackingId && open) {
      fetchComplaint();
    }
  }, [trackingId, open]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/complaints/track/${encodeURIComponent(trackingId)}`
      );
      setComplaint(data.complaint);
    } catch (err) {
      console.error("Tracking error:", err);
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: "hidden" },
      }}
    >
      <DialogTitle
        sx={{ fontWeight: 700, background: "#1e3a8a", color: "white" }}
      >
        Complaint Tracking — {trackingId || ""}
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 0, // remove default padding so TrackStatus fits perfectly
          background: "linear-gradient(135deg,#dbeafe,#eef2ff)",
        }}
      >
        {loading ? (
          <Box textAlign="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TrackStatus
            externalComplaint={complaint}
            externalTrackingId={trackingId}
            mode="modal"
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ bgcolor: "#1e3a8a", px: 4, fontWeight: 700 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
