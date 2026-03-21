import React, { useRef, useState } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import api from "../services/api";
import { useThemeMode } from "../App";

const LIMIT_MB = 100;
const FILE_LIMIT_MB = 10;

export default function FileUpload({ refresh, usedMB = 0 }) {
  const { darkMode }      = useThemeMode();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [snack, setSnack]         = useState({ open: false, message: "", severity: "success" });
  const fileInput = useRef();

  const show = (message, severity = "success") => setSnack({ open: true, message, severity });

  const remainingMB = LIMIT_MB - usedMB;
  const selectedMB  = Array.from(fileList).reduce((s, f) => s + f.size, 0) / (1024 * 1024);
  const wouldExceed = selectedMB > remainingMB;
  const hasOversized = Array.from(fileList).some(f => f.size > FILE_LIMIT_MB * 1024 * 1024);

  const handleUpload = async () => {
    if (!fileList.length) return;

    if (hasOversized) {
      show(`Each file must be under ${FILE_LIMIT_MB} MB.`, "error");
      return;
    }
    if (wouldExceed) {
      show(`Not enough storage. You have ${remainingMB.toFixed(1)} MB left.`, "error");
      return;
    }

    const formData = new FormData();
    Array.from(fileList).forEach(f => formData.append("files", f));
    setUploading(true);
    try {
      await api.post("/file/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      show("Encrypted and uploaded successfully");
      setFileList([]);
      refresh?.();
    } catch (err) {
      const msg = err.response?.data || "Upload failed.";
      show(msg, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setFileList(e.dataTransfer.files);
  };

  const zoneBg  = dragOver
    ? "rgba(124,58,237,0.08)"
    : darkMode ? "rgba(255,255,255,0.02)" : "rgba(124,58,237,0.02)";
  const zoneBdr = dragOver
    ? "#7c3aed"
    : darkMode ? "rgba(255,255,255,0.12)" : "rgba(124,58,237,0.2)";
  const textColor  = darkMode ? "rgba(241,240,255,0.4)"  : "rgba(13,11,30,0.45)";
  const accentText = darkMode ? "#a78bfa"                : "#7c3aed";

  const btnDisabled = uploading || wouldExceed || hasOversized;

  return (
    <Box>
      <Box
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInput.current.click()}
        sx={{
          border: "0.5px dashed", borderColor: zoneBdr,
          borderRadius: "10px", p: 3, textAlign: "center",
          cursor: "pointer", transition: "all 0.2s", background: zoneBg,
          "&:hover": { borderColor: "#7c3aed", background: "rgba(124,58,237,0.05)" },
        }}
      >
        <input type="file" multiple style={{ display: "none" }} ref={fileInput}
          onChange={e => setFileList(e.target.files)} />
        <Typography sx={{ fontSize: 20, mb: 0.5, color: accentText }}>↑</Typography>
        <Typography sx={{ fontSize: 13, color: textColor }}>
          Drop files or{" "}
          <Box component="span" sx={{ color: accentText, fontWeight: 500 }}>browse</Box>
        </Typography>
        <Typography sx={{ fontSize: 11, color: textColor, mt: 0.5 }}>
          Max {FILE_LIMIT_MB} MB per file · {remainingMB.toFixed(0)} MB remaining
        </Typography>
        {fileList.length > 0 && (
          <Typography sx={{ fontSize: 11, color: accentText, mt: 0.8, fontWeight: 500 }}>
            {fileList.length} file{fileList.length > 1 ? "s" : ""} selected
            {" "}({selectedMB.toFixed(1)} MB)
          </Typography>
        )}
      </Box>

      {/* Warnings */}
      {fileList.length > 0 && hasOversized && (
        <Box sx={{ mt: 1, px: 1.5, py: 1, borderRadius: "7px",
          background: "rgba(239,68,68,0.07)", border: "0.5px solid rgba(239,68,68,0.2)" }}>
          <Typography sx={{ fontSize: 11, color: "#f87171", lineHeight: 1.6 }}>
            ⚠ One or more files exceed the {FILE_LIMIT_MB} MB per-file limit.
          </Typography>
        </Box>
      )}
      {fileList.length > 0 && wouldExceed && !hasOversized && (
        <Box sx={{ mt: 1, px: 1.5, py: 1, borderRadius: "7px",
          background: "rgba(239,68,68,0.07)", border: "0.5px solid rgba(239,68,68,0.2)" }}>
          <Typography sx={{ fontSize: 11, color: "#f87171", lineHeight: 1.6 }}>
            ⚠ Not enough storage space. These files ({selectedMB.toFixed(1)} MB) exceed your remaining {remainingMB.toFixed(1)} MB.
          </Typography>
        </Box>
      )}

      {/* Upload button */}
      {fileList.length > 0 && (
        <Box
          onClick={btnDisabled ? undefined : handleUpload}
          sx={{
            mt: 1.5, py: 1.2, borderRadius: "8px",
            background: btnDisabled
              ? darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
              : "linear-gradient(135deg,#7c3aed,#0ea5e9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: btnDisabled ? "not-allowed" : "pointer",
            boxShadow: btnDisabled ? "none" : "0 0 20px rgba(124,58,237,0.2)",
            "&:hover": { opacity: btnDisabled ? 1 : 0.9 },
          }}
        >
          <Typography sx={{
            fontSize: 13, fontWeight: 500,
            color: btnDisabled
              ? darkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"
              : "#fff",
          }}>
            {uploading
              ? "Encrypting & uploading..."
              : wouldExceed || hasOversized
              ? "Cannot upload — fix errors above"
              : `Upload ${fileList.length} file${fileList.length > 1 ? "s" : ""} (${selectedMB.toFixed(1)} MB) →`}
          </Typography>
        </Box>
      )}

      <Snackbar open={snack.open} autoHideDuration={3000}
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