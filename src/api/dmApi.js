import api from "./axiosConfig";

// Assign a new visit to officer
export const assignVisit = (data) => api.post("/dm/assign", data);

// Get all visits assigned by current DM
export const getMyAssignments = () => api.get("/dm/my-assignments");

// Get all visits assigned to a particular officer
export const getOfficerAssignments = (id) => api.get(`/dm/officer/${id}`);
