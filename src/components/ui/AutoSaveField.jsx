// Path: frontend/src/components/ui/AutoSaveField.jsx
import React from "react";
import { TextField, Box, Typography } from "@mui/material";
import useAutoSave from "../../hooks/useAutoSave";

const AutoSaveField = ({ id, value: initial = "", onSave, label, multiline = false, rows = 3 }) => {
  const [value, setValue] = React.useState(initial);
  const [saving, setSaving] = React.useState(false);

  // custom hook returns debounced save trigger
  const triggerSave = useAutoSave(async (v) => {
    setSaving(true);
    try {
      await onSave(v);
    } finally {
      setSaving(false);
    }
  }, 1200);

  React.useEffect(() => {
    setValue(initial);
  }, [initial]);

  const handleChange = (e) => {
    setValue(e.target.value);
    triggerSave(e.target.value);
  };

  return (
    <Box>
      <TextField
        fullWidth
        id={id}
        label={label}
        value={value}
        onChange={handleChange}
        multiline={multiline}
        rows={rows}
        variant="outlined"
        size="small"
      />
      <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "#6b7280" }}>
        {saving ? "Saving..." : "Auto-saved"}
      </Typography>
    </Box>
  );
};

export default AutoSaveField;
