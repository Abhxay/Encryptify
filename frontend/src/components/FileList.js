import React, { useEffect, useState } from "react";
import { Box, Typography, Snackbar, Alert, Tooltip } from "@mui/material";
import api from "../services/api";
import { useThemeMode } from "../App";

const typeColor = (mime = "") => {
  if (mime.includes("pdf"))                          return { bg: "rgba(239,68,68,0.1)",   color: "#ef4444", label: "PDF" };
  if (mime.includes("image"))                        return { bg: "rgba(14,165,233,0.1)",  color: "#0ea5e9", label: "IMG" };
  if (mime.includes("zip") || mime.includes("compressed")) return { bg: "rgba(124,58,237,0.1)", color: "#7c3aed", label: "ZIP" };
  if (mime.includes("text"))                         return { bg: "rgba(16,185,129,0.1)",  color: "#10b981", label: "TXT" };
  if (mime.includes("word") || mime.includes("doc")) return { bg: "rgba(59,130,246,0.1)",  color: "#3b82f6", label: "DOC" };
  if (mime.includes("video"))                        return { bg: "rgba(245,158,11,0.1)",  color: "#f59e0b", label: "VID" };
  return { bg: "rgba(107,114,128,0.1)", color: "#6b7280", label: "FILE" };
};

function FileCard({ file, onDownload, onDelete, onShare, darkMode }) {
  const [hovered, setHovered] = useState(false);
  const type    = typeColor(file.mimeType);
  const sizeKB  = ((file.sizeBytes || 0) / 1024).toFixed(1);
  const textPri = darkMode ? "#f1f0ff"                : "#0d0b1e";
  const textSec = darkMode ? "rgba(241,240,255,0.35)" : "rgba(13,11,30,0.45)";
  const cardBg  = hovered
    ? darkMode ? "rgba(124,58,237,0.05)" : "rgba(124,58,237,0.04)"
    : darkMode ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.7)";
  const cardBdr = hovered
    ? "rgba(124,58,237,0.3)"
    : darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        display: "flex", alignItems: "center", gap: 1.5,
        p: "10px 12px", borderRadius: "10px",
        border: "0.5px solid", borderColor: cardBdr,
        background: cardBg,
        transition: "all 0.15s ease", mb: 1,
      }}
    >
      {/* Type badge */}
      <Box sx={{
        width: 34, height: 34, borderRadius: "8px", flexShrink: 0,
        background: type.bg, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: type.color, letterSpacing: "0.05em" }}>
          {type.label}
        </Typography>
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Tooltip title={file.filename} placement="top-start">
          <Typography sx={{
            fontSize: 13, color: textPri, fontWeight: 500,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {file.filename}
            {file.sharedByYou && (
              <Box component="span" sx={{
                ml: 1, px: "6px", py: "1px", borderRadius: "4px", fontSize: 10,
                background: "rgba(14,165,233,0.1)", border: "0.5px solid rgba(14,165,233,0.25)",
                color: "#0ea5e9", fontWeight: 500,
              }}>shared</Box>
            )}
            {file.sharedBy && (
              <Box component="span" sx={{
                ml: 1, px: "6px", py: "1px", borderRadius: "4px", fontSize: 10,
                background: "rgba(124,58,237,0.1)", border: "0.5px solid rgba(124,58,237,0.25)",
                color: "#7c3aed", fontWeight: 500,
              }}>from {file.sharedBy}</Box>
            )}
          </Typography>
        </Tooltip>
        <Typography sx={{ fontSize: 11, color: textSec, mt: "1px" }}>
          {sizeKB} KB
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 0.5, opacity: hovered ? 1 : 0, transition: "opacity 0.15s" }}>
        {[
          { label: "↓", title: "Download", onClick: () => onDownload(file.filename), hoverColor: "#0ea5e9" },
          { label: "↗", title: "Share",    onClick: () => onShare(file.id),          hoverColor: "#7c3aed" },
          { label: "×", title: "Delete",   onClick: () => onDelete(file.id, !!file.sharedBy), hoverColor: "#ef4444" },
        ].map(action => (
          <Tooltip title={action.title} key={action.label}>
            <Box onClick={action.onClick} sx={{
              width: 26, height: 26, borderRadius: "6px", cursor: "pointer",
              background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              border: "0.5px solid",
              borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13,
              color: darkMode ? "rgba(241,240,255,0.4)" : "rgba(13,11,30,0.4)",
              transition: "all 0.15s",
              "&:hover": { color: action.hoverColor, borderColor: action.hoverColor,
                background: `${action.hoverColor}14` },
            }}>
              {action.label}
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}

export default function FileList({ refreshFlag, triggerRefresh }) {
  const { darkMode } = useThemeMode();
  const [files, setFiles] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const show = (msg, severity = "success") => setSnack({ open: true, message: msg, severity });

  useEffect(() => {
    api.get("/file/list")
      .then(res => setFiles(Array.isArray(res.data) ? res.data : []))
      .catch(() => show("Could not load files.", "error"));
  }, [refreshFlag]);

  const handleDownload = async (filename) => {
    try {
      const res = await api.get(`/file/download/${filename}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement("a");
      a.href = url; a.setAttribute("download", filename);
      document.body.appendChild(a); a.click(); a.remove();
      show("Downloaded successfully");
    } catch { show("Download failed.", "error"); }
  };

  const handleDelete = async (id, shared) => {
    try {
      if (shared) await api.delete(`/file/unshare/${id}`);
      else        await api.delete(`/file/delete/${id}`);
      show("Removed successfully");
      triggerRefresh?.();
    } catch { show("Delete failed.", "error"); }
  };

  const handleShare = async (id) => {
    const username = prompt("Share with username:");
    if (!username) return;
    try {
      await api.post(`/file/share/${id}?username=${username}`);
      show(`Shared with ${username}`);
      triggerRefresh?.();
    } catch { show("Share failed. User may not exist.", "error"); }
  };

  const textSec = darkMode ? "rgba(241,240,255,0.25)" : "rgba(13,11,30,0.35)";

  if (files.length === 0) {
    return (
      <Box sx={{ py: 3, textAlign: "center" }}>
        <Typography sx={{ fontSize: 13, color: textSec }}>
          No files yet. Upload your first file above.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography sx={{ fontSize: 11, color: textSec, mb: 1.5,
        textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {files.length} file{files.length !== 1 ? "s" : ""}
      </Typography>
      {files.map(file => (
        <FileCard key={file.id} file={file} darkMode={darkMode}
          onDownload={handleDownload} onDelete={handleDelete} onShare={handleShare} />
      ))}
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