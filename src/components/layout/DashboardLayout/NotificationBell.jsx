// Path: frontend/src/components/layout/DashboardLayout/NotificationBell.jsx
import React from "react";
import { Badge, IconButton, Popover, List, ListItem, ListItemText, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import moment from "moment";

const sample = [
  { id: 1, title: "New complaint assigned", time: moment().subtract(10, "m") },
  { id: 2, title: "Report generation ready", time: moment().subtract(1, "h") },
];

const NotificationBell = () => {
  const [anchor, setAnchor] = React.useState(null);

  const open = Boolean(anchor);
  const handleOpen = (e) => setAnchor(e.currentTarget);
  const handleClose = () => setAnchor(null);

  return (
    <>
      <IconButton onClick={handleOpen} aria-label="notifications" size="large">
        <Badge badgeContent={sample.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <List sx={{ width: 320, maxWidth: "100%" }}>
          <ListItem>
            <ListItemText primary={<Typography sx={{ fontWeight: 700 }}>Notifications</Typography>} />
          </ListItem>
          {sample.map((n) => (
            <ListItem key={n.id} divider>
              <ListItemText primary={n.title} secondary={n.time.fromNow()} />
            </ListItem>
          ))}
          <ListItem button onClick={handleClose}>
            <ListItemText primary="See all notifications" sx={{ textAlign: "center" }} />
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

export default NotificationBell;
