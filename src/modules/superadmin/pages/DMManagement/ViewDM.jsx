// ViewDM.jsx
import React, { useEffect, useState } from "react";
import axios from "../../../../api/axiosConfig";
import { Box, Card, CardContent, Typography, Button, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

export default function ViewDM() {
  const { id } = useParams();
  const [dm, setDm] = useState(null);

  useEffect(()=> {
    const load = async () => {
      try {
        const { data } = await axios.get(`/admin/users/${id}`);
        setDm(data.user);
      } catch(e) { console.error(e); }
    };
    load();
  }, [id]);

  if (!dm) return <Box className="py-5 text-center"><CircularProgress /></Box>;

  return (
    <Box className="container-fluid py-4">
      <Card>
        <CardContent>
          <div className="row">
            <div className="col-md-8">
              <Typography variant="h5" sx={{ color: "#1e3a8a", fontWeight: 800 }}>{dm.firstName} {dm.lastName}</Typography>
              <Typography color="text.secondary">{dm.email}</Typography>
              <Typography sx={{ mt: 2 }}><strong>District:</strong> {dm.district || "—"}</Typography>
              <Typography><strong>Phone:</strong> {dm.phone || "—"}</Typography>
            </div>
            <div className="col-md-4 text-end">
              <Button href={`/superadmin/dm/edit/${dm._id}`} variant="contained" sx={{ bgcolor: "#1e3a8a" }}>Edit</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
