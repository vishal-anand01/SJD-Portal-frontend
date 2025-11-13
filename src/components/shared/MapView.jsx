// Path: frontend/src/components/shared/MapView.jsx
import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

const MapView = ({ height = "400px" }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (!window.google) {
      console.log("Google Maps SDK not loaded, showing placeholder.");
      return;
    }
    new window.google.maps.Map(mapRef.current, {
      center: { lat: 25.5941, lng: 85.1376 },
      zoom: 12,
    });
  }, []);

  return (
    <Box sx={{ borderRadius: 2, overflow: "hidden", position: "relative", boxShadow: 2 }}>
      <div ref={mapRef} style={{ width: "100%", height }} />
      {!window.google && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(240,243,255,0.9)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Map placeholder — load Google Maps API to view live map
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MapView;
