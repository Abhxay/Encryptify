import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Stack,
  Typography,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import api from "../services/api";

export default function FileUpload({ refresh }) {
  const [fileList, setFileList] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const fileInput = useRef();

  const showMessage = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileList.length) {
      showMessage("No files selected!", "warning");
      return;
    }
    const formData = new FormData();
    Array.from(fileList).forEach((file) => {
      formData.append("files", file);
    });

    try {
      await api.post("/api/file/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showMessage("Upload successful!", "success");
      setFileList([]);
      if (refresh) refresh(); // Trigger parent refresh after upload
    } catch (err) {
      console.error("Upload failed:", err);
      showMessage("Upload failed.", "error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFileList(e.dataTransfer.files);
  };

  return (
    <Card sx={{ p: 0.5, bgcolor: "background.paper", boxShadow: 6 }}>
      <CardContent>
        <form onSubmit={handleUpload} autoComplete="off" encType="multipart/form-data">
          <Stack spacing={2} alignItems="center">
            <Box
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInput.current.click()}
              sx={{
                border: "2px dashed #13c2c2",
                borderRadius: 3,
                py: 3,
                px: 2,
                width: "100%",
                background: "#f9fafb",
                color: "primary.main",
                cursor: "pointer",
                textAlign: "center",
                transition: "box-shadow 0.2s, background 0.2s",
                "&:hover": {
                  boxShadow: 3,
                  background: "#e3f5f8",
                },
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 46 }} />
              <Typography fontWeight={700} color="primary.main">
                Drag & drop files here, or click to select
              </Typography>
              <input
                type="file"
                name="files"
                multiple
                style={{ display: "none" }}
                ref={fileInput}
                onChange={(e) => setFileList(e.target.files)}
              />
              <Typography variant="caption">
                {fileList.length
                  ? Array.from(fileList)
                      .map((f) => f.name)
                      .join(", ")
                  : "No files selected"}
              </Typography>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                fontWeight: 700,
                boxShadow: 2,
                mt: 1,
                "&:hover": { bgcolor: "primary.dark", transform: "scale(1.05)" },
              }}
              startIcon={<CloudUploadIcon />}
              disabled={!fileList.length}
            >
              Upload
            </Button>
          </Stack>
        </form>
      </CardContent>

      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
