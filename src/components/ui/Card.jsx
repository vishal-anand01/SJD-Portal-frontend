// Path: frontend/src/components/ui/Card.jsx
import React from "react";
import { Card as MUICard, CardContent, CardHeader, Box, Typography } from "@mui/material";

const Card = ({ title, subtitle, children, action, icon, sx = {} }) => {
  return (
    <MUICard elevation={3} sx={{ borderRadius: 2, ...sx }}>
      {title && (
        <CardHeader
          avatar={icon}
          title={<Typography sx={{ fontWeight: 800 }}>{title}</Typography>}
          subheader={subtitle}
          action={action}
          sx={{ pb: 0.5 }}
        />
      )}
      <CardContent>
        <Box>{children}</Box>
      </CardContent>
    </MUICard>
  );
};

export default Card;
