// frontend/src/router/SuperAdminRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout/DashboardLayout";

// ⭐ Import SuperAdmin module pages
import {
  Dashboard,
  DMList,
  AddDM,
  EditDM,
  ViewDM,

  DepartmentList,
  AddDepartment,
  EditDepartment,
  ViewDepartment,

  OfficerList,
  AddOfficer,
  EditOfficer,
  ViewOfficer,

  PublicList,
  AddPublic,
  EditPublic,
  ViewPublic,


} from "../modules/superadmin";

/* ----------------------------------------------------------
   ⭐ SUPERADMIN ROUTES CONFIG 
----------------------------------------------------------- */

export const SuperAdminRoutesConfig = [
  { path: "dashboard", element: <Dashboard /> },

  // DM Management
  { path: "dm", element: <DMList /> },
  { path: "dm/add", element: <AddDM /> },
  { path: "dm/edit/:id", element: <EditDM /> },
  { path: "dm/view/:id", element: <ViewDM /> },

  // Department Management
  { path: "departments", element: <DepartmentList /> },
  { path: "departments/add", element: <AddDepartment /> },
  { path: "departments/edit/:id", element: <EditDepartment /> },
  { path: "departments/view/:id", element: <ViewDepartment /> },

  // Officer Management
  { path: "officers", element: <OfficerList /> },
  { path: "officers/add", element: <AddOfficer /> },
  { path: "officers/edit/:id", element: <EditOfficer /> },
  { path: "officers/view/:id", element: <ViewOfficer /> },

  // Public Management
  { path: "public", element: <PublicList /> },
  { path: "public/add", element: <AddPublic /> },
  { path: "public/edit/:id", element: <EditPublic /> },
  { path: "public/view/:id", element: <ViewPublic /> },

  
];

/* ----------------------------------------------------------
   ⭐ SUPERADMIN ROUTES WRAPPER  
----------------------------------------------------------- */

export function SuperAdminRoutes() {
  return (
    <Route element={<DashboardLayout role="superadmin" />}>
      {SuperAdminRoutesConfig.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Route>
  );
}

// ⭐ DEFAULT EXPORT (REQUIRED)
export default SuperAdminRoutes;
