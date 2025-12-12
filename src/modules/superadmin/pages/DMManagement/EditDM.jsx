// EditDM.jsx
import React, { useEffect, useState } from "react";
import axios from "../../../../api/axiosConfig";
import { Box, Card, CardContent, TextField, Button, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditDM() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    const load = async () => {
      try {
        const { data } = await axios.get(`/admin/users/${id}`);
        setForm(data.user);
      } catch(e) { console.error(e); }
    };
    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/admin/users/${id}`, form);
      Swal.fire("Saved", "DM updated", "success");
      window.history.back();
    } catch (e) {
      Swal.fire("Error", e.response?.data?.message || "Failed", "error");
    } finally { setLoading(false); }
  };

  if (!form) return <Box className="py-5 text-center"><CircularProgress /></Box>;

  return (
    <Box className="container-fluid py-4">
      <Card><CardContent>
        <h5 style={{ color: "#1e3a8a" }}>Edit DM</h5>
        <form onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-6"><TextField label="First Name" required fullWidth value={form.firstName} onChange={(e)=>setForm({...form, firstName:e.target.value})} /></div>
            <div className="col-md-6"><TextField label="Last Name" required fullWidth value={form.lastName} onChange={(e)=>setForm({...form, lastName:e.target.value})} /></div>
            <div className="col-md-6"><TextField label="Email" required fullWidth value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} /></div>
            <div className="col-md-6"><TextField label="Phone" fullWidth value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} /></div>
            <div className="col-12 text-end mt-2"><Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: "#1e3a8a" }}>{loading ? "Saving..." : "Save"}</Button></div>
          </div>
        </form>
      </CardContent></Card>
    </Box>
  );
}
