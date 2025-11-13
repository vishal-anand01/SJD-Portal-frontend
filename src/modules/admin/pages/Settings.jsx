// Path: frontend/src/modules/admin/pages/Settings.jsx
import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Typography, Button, Box } from "@mui/material";
import AutoSaveField from "../../../components/ui/AutoSaveField";
import useAuth from "../../../hooks/useAuth";

const Settings = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = React.useState({ name: user?.name || "", email: user?.email || "" });

  const saveField = async (value) => {
    // Simulate update
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  };

  return (
    <Container fluid>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
        Settings
      </Typography>

      <Row>
        <Col md={6}>
          <Form>
            <Box sx={{ mb: 3 }}>
              <AutoSaveField label="Full Name" value={profile.name} onSave={saveField} />
            </Box>
            <Box sx={{ mb: 3 }}>
              <AutoSaveField label="Email Address" value={profile.email} onSave={saveField} />
            </Box>

            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
