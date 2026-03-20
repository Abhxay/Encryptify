import React, { useEffect, useState } from "react";
import { Box, Typography, Snackbar, Alert, Tooltip } from "@mui/material";
import api from "../services/api";

const typeColor = (mime = "") => {
  if (mime.includes("pdf")) return { bg: "rgba(248,113,113,0.1)", color: "#f87171", label: "PDF" };
  if (mime.includes("image")) return { bg: "rgba(56,189,248,0.1)", color: "#38bdf8", label: "IMG" };
  if (mime.includes("zip") || mime.includes("compressed")) return { bg: "rgba(167,139,250,0.1)", color: "#a78bfa", label: "ZIP" };
  if (mime.includes("text")) return { bg: "rgba(52,211,153,0.1)", color: "#34d399", label: "TXT" };
  if (mime.includes("word") || mime.includes("doc")) return { bg: "rgba(59,130,246,0.1)", color: "#60a5fa", label: "DOC" };
  if (mime.includes("video")) return { bg: "rgba(251,191,36,0.1)", color: "#fbbf24", label: "VID" };
  return { bg: "rgba(156,163,175,0.1)", color: "#9ca3af", label: "FILE" };
};

function FileCard({ file, onDownload, onDelete, onShare }) {
  const [hovered, setHovered] = useState(false);
  const type = typeColor(file.mimeType);
  const sizeKB = ((file.sizeBytes || 0) / 1024).toFixed(1);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        display: "flex", alignItems: "center", gap: 1.5,
        p: "10px 12px", borderRadius: "10px",
        border: "0.5px solid",
        borderColor: hovered ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.05)",
        background: hovered ? "rgba(124,58,237,0.04)" : "rgba(255,255,255,0.02)",
        transition: "all 0.15s ease", cursor: "default", mb: 1,
      }}
    >
      {/* Type icon */}
      <Box sx={{
        width: 34, height: 34, borderRadius: "8px", flexShrink: 0,
        background: type.bg, display: "flex", alignItems: "center",
        justifyContent: "center",
      }}>
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: type.color, letterSpacing: "0.05em" }}>
          {type.label}
        </Typography>
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Tooltip title={file.filename} placement="top-start">
          <Typography sx={{
            fontSize: 13, color: "#f1f0ff", fontWeight: 500,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {file.filename}
            {file.sharedByYou && (
              <Box component="span" sx={{
                ml: 1, px: "6px", py: "1px", borderRadius: "4px", fontSize: 10,
                background: "rgba(14,165,233,0.1)", border: "0.5px solid rgba(14,165,233,0.2)",
                color: "#38bdf8", fontWeight: 500,
              }}>shared</Box>
            )}
            {file.sharedBy && (
              <Box component="span" sx={{
                ml: 1, px: "6px", py: "1px", borderRadius: "4px", fontSize: 10,
                background: "rgba(124,58,237,0.1)", border: "0.5px solid rgba(124,58,237,0.2)",
                color: "#a78bfa", fontWeight: 500,
              }}>from {file.sharedBy}</Box>
            )}
          </Typography>
        </Tooltip>
        <Typography sx={{ fontSize: 11, color: "rgba(241,240,255,0.3)", mt: "1px" }}>
          {sizeKB} KB
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 0.5, opacity: hovered ? 1 : 0, transition: "opacity 0.15s" }}>
        {[
          { label: "↓", title: "Download", onClick: () => onDownload(file.filename), color: "#38bdf8" },
          { label: "↗", title: "Share", onClick: () => onShare(file.id), color: "#a78bfa" },
          { label: "×", title: "Delete", onClick: () => onDelete(file.id, !!file.sharedBy), color: "#f87171" },
        ].map((action) => (
          <Tooltip title={action.title} key={action.label}>
            <Box
              onClick={action.onClick}
              sx={{
                width: 26, height: 26, borderRadius: "6px", cursor: "pointer",
                background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: "rgba(241,240,255,0.4)",
                transition: "all 0.15s",
                "&:hover": { background: "rgba(255,255,255,0.08)", color: action.color, borderColor: "rgba(255,255,255,0.15)" },
              }}
            >
              {action.label}
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}

export default function FileList({ refreshFlag, triggerRefresh }) {
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
      const a = document.createElement("a");
      a.href = url; a.setAttribute("download", filename);
      document.body.appendChild(a); a.click(); a.remove();
      show("Downloaded successfully");
    } catch { show("Download failed.", "error"); }
  };

  const handleDelete = async (id, shared) => {
    try {
      if (shared) await api.delete(`/file/unshare/${id}`);
      else await api.delete(`/file/delete/${id}`);
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
    } catch { show("Share failed.", "error"); }
  };

  if (files.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography sx={{ fontSize: 13, color: "rgba(241,240,255,0.25)" }}>
          No files yet. Upload your first file above.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography sx={{ fontSize: 11, color: "rgba(241,240,255,0.25)", mb: 1.5,
        textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {files.length} file{files.length !== 1 ? "s" : ""}
      </Typography>
      {files.map(file => (
        <FileCard key={file.id} file={file}
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