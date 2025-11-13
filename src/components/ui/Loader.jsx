// Path: frontend/src/components/ui/Loader.jsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = ({ text = "Loading...", fullScreen = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        ...(fullScreen && {
          position: "fixed",
          inset: 0,
          background: "rgba(255,255,255,0.7)",
          zIndex: 2000,
        }),
      }}
    >
      <CircularProgress />
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {text}
      </Typography>
    </Box>
  );
};

export default Loader;
