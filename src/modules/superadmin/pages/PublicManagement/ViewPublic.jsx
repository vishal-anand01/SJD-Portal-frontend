import React, { useEffect, useState } from "react";
import { Paper, Typography, Avatar } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "../../../../api/axiosConfig";
import { deepOrange } from "@mui/material/colors";

export default function ViewPublic() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    const { data } = await axios.get(`/superadmin/public/${id}`);
    setUser(data.user);
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (!user) return <p className="text-center mt-4">Loading...</p>;

  const initials =
    user.firstName?.[0]?.toUpperCase() + (user.lastName?.[0] || "").toUpperCase();

  return (
    <div className="container py-4">
      <Paper className="p-4 shadow-lg" sx={{ borderRadius: 4 }}>
        <div className="text-center">
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: deepOrange[500],
              fontSize: 40,
              margin: "0 auto",
            }}
          >
            {initials}
          </Avatar>
          <Typography variant="h5" className="mt-3 fw-bold">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography className="text-muted">{user.email}</Typography>
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <Typography>
              <strong>Phone:</strong> {user.phone || "N/A"}
            </Typography>
          </div>

          <div className="col-md-6">
            <Typography>
              <strong>Pincode:</strong> {user.pincode || "N/A"}
            </Typography>
          </div>

          <div className="col-12 mt-3">
            <Typography>
              <strong>Created At:</strong>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </Typography>
          </div>
        </div>
      </Paper>
    </div>
  );
}
