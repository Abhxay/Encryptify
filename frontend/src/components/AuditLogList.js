import React, { useEffect, useState } from "react";
import { Box, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import api from "../services/api";

const actionConfig = {
  UPLOAD:   { icon: "↑", color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  DOWNLOAD: { icon: "↓", color: "#38bdf8", bg: "rgba(56,189,248,0.1)" },
  SHARE:    { icon: "↗", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  DELETE:   { icon: "×", color: "#f87171", bg: "rgba(248,113,113,0.1)" },
  UNSHARE:  { icon: "↙", color: "#fb923c", bg: "rgba(251,146,60,0.1)" },
};

function timeAgo(timestamp) {
  if (!timestamp) return "";
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

export default function AuditLogList({ refreshFlag }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    setLoading(true);
    api.get("/file/audit/mine")
      .then(res => setLogs(Array.isArray(res.data) ? res.data.slice().reverse() : []))
      .catch(() => setSnack({ open: true, message: "Could not load activity.", severity: "error" }))
      .finally(() => setLoading(false));
  }, [refreshFlag]);

  const handleClear = async () => {
    if (!window.confirm("Clear all activity history?")) return;
    try {
      await api.clearMyAuditLogs();
      setLogs([]);
      setSnack({ open: true, message: "Activity cleared.", severity: "success" });
    } catch { setSnack({ open: true, message: "Failed to clear.", severity: "error" }); }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={20} sx={{ color: "#7c3aed" }} />
      </Box>
    );
  }

  if (logs.length === 0) {
    return (
      <Typography sx={{ fontSize: 13, color: "rgba(241,240,255,0.25)", py: 3, textAlign: "center" }}>
        No activity yet.
      </Typography>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography sx={{ fontSize: 12, color: "rgba(241,240,255,0.3)" }}>
          {logs.length} events
        </Typography>
        <Box onClick={handleClear} sx={{
          fontSize: 11, color: "rgba(248,113,113,0.5)", cursor: "pointer",
          "&:hover": { color: "#f87171" }, transition: "color 0.15s",
        }}>
          Clear all
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {logs.map((log, i) => {
          const cfg = actionConfig[log.action] || { icon: "·", color: "#9ca3af", bg: "rgba(156,163,175,0.1)" };
          return (
            <Box key={log.id || i} sx={{
              display: "flex", alignItems: "flex-start", gap: 1.5,
              py: 1.5, borderBottom: i < logs.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none",
            }}>
              <Box sx={{
                width: 26, height: 26, borderRadius: "7px", flexShrink: 0,
                background: cfg.bg, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 12, color: cfg.color, mt: "1px",
              }}>
                {cfg.icon}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, color: "rgba(241,240,255,0.7)" }}>
                  <Box component="span" sx={{ color: cfg.color, fontWeight: 500, textTransform: "capitalize" }}>
                    {log.action?.toLowerCase()}
                  </Box>
                  {" · "}
                  <Box component="span" sx={{
                    color: "#f1f0ff", fontWeight: 500,
                    maxWidth: 160, display: "inline-block",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    verticalAlign: "bottom",
                  }}>
                    {log.target}
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: 11, color: "rgba(241,240,255,0.25)", mt: "2px" }}>
                  {timeAgo(log.timestamp)}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Snackbar open={snack.open} autoHideDuration={2500}
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