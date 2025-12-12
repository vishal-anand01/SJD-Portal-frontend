// EditDepartment.jsx
import React, { useEffect, useState } from "react";
import axios from "../../../../api/axiosConfig";
import { Box, Card, CardContent, TextField, Button, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditDepartment() {
  const { id } = useParams();
  const [dep, setDep] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    const load = async () => {
      const { data } = await axios.get(`/admin/departments/${id}`);
      setDep(data.department);
    };
    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/admin/departments/${id}`, dep);
      Swal.fire("Saved", "Department updated", "success");
      window.history.back();
    } catch(e) { Swal.fire("Error", e.response?.data?.message || "Failed", "error"); }
    finally { setLoading(false); }
  };

  if (!dep) return <Box className="py-5 text-center"><CircularProgress /></Box>;

  return (
    <Box className="container-fluid py-4">
      <Card><CardContent>
        <h5 style={{ color: "#1e3a8a" }}>Edit Department</h5>
        <form onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-6"><TextField label="Department Name" fullWidth value={dep.name} onChange={(e)=>setDep({...dep, name:e.target.value})} /></div>
            <div className="col-md-6"><TextField label="Contact Email" fullWidth value={dep.contactEmail} onChange={(e)=>setDep({...dep, contactEmail:e.target.value})} /></div>
            <div className="col-md-12"><TextField label="Description" fullWidth multiline rows={3} value={dep.description} onChange={(e)=>setDep({...dep, description:e.target.value})} /></div>
            <div className="col-12 text-end"><Button type="submit" variant="contained" sx={{ bgcolor: "#1e3a8a" }}>{loading ? "Saving..." : "Save Changes"}</Button></div>
          </div>
        </form>
      </CardContent></Card>
    </Box>
  );
}
