import React, { useRef, useState } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import api from "../services/api";

export default function FileUpload({ refresh }) {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const fileInput = useRef();

  const show = (message, severity = "success") => setSnack({ open: true, message, severity });

  const handleUpload = async () => {
    if (!fileList.length) return;
    const formData = new FormData();
    Array.from(fileList).forEach(f => formData.append("files", f));
    setUploading(true);
    try {
      await api.post("/file/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      show("Encrypted and uploaded successfully");
      setFileList([]);
      refresh?.();
    } catch { show("Upload failed.", "error"); }
    finally { setUploading(false); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setFileList(e.dataTransfer.files);
  };

  return (
    <Box>
      <Box
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInput.current.click()}
        sx={{
          border: "0.5px dashed",
          borderColor: dragOver ? "#7c3aed" : "rgba(255,255,255,0.1)",
          borderRadius: "10px", p: 3, textAlign: "center",
          cursor: "pointer", transition: "all 0.2s",
          background: dragOver ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.02)",
          "&:hover": { borderColor: "rgba(124,58,237,0.4)", background: "rgba(124,58,237,0.04)" },
        }}
      >
        <input type="file" multiple style={{ display: "none" }} ref={fileInput}
          onChange={e => setFileList(e.target.files)} />
        <Typography sx={{ fontSize: 20, mb: 1 }}>↑</Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(241,240,255,0.4)" }}>
          Drop files or{" "}
          <Box component="span" sx={{ color: "#a78bfa", fontWeight: 500 }}>browse</Box>
        </Typography>
        {fileList.length > 0 && (
          <Typography sx={{ fontSize: 11, color: "#a78bfa", mt: 1, fontWeight: 500 }}>
            {fileList.length} file{fileList.length > 1 ? "s" : ""} selected
          </Typography>
        )}
      </Box>

      {fileList.length > 0 && (
        <Box
          onClick={handleUpload}
          sx={{
            mt: 1.5, py: 1.2, borderRadius: "8px",
            background: uploading ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg, #7c3aed, #0ea5e9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: uploading ? "not-allowed" : "pointer",
            transition: "opacity 0.2s",
            boxShadow: "0 0 20px rgba(124,58,237,0.2)",
            "&:hover": { opacity: uploading ? 1 : 0.9 },
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>
            {uploading ? "Encrypting & uploading..." : `Upload ${fileList.length} file${fileList.length > 1 ? "s" : ""} →`}
          </Typography>
        </Box>
      )}

      <Snackbar open={snack.open} autoHideDuration={2000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snack.severity} variant="filled"
          onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}