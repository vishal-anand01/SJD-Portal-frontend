// Path: frontend/src/modules/department/pages/UpdateStatus.jsx
import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Typography, Button } from "@mui/material";
import AutoSaveField from "../../../components/ui/AutoSaveField";

const UpdateStatus = () => {
  const [status, setStatus] = React.useState("open");
  const [remarks, setRemarks] = React.useState("");

  const handleSave = async () => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <Container fluid>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
        Update Complaint Status
      </Typography>

      <Row>
        <Col md={6}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="open">Open</option>
                <option value="inprogress">In Progress</option>
                <option value="closed">Closed</option>
              </Form.Select>
            </Form.Group>

            <AutoSaveField label="Remarks" multiline value={remarks} onSave={handleSave} />

            <Button variant="contained" sx={{ mt: 3 }}>
              Save
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateStatus;
