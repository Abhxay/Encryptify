import React, { useEffect, useState } from "react";
import { Box, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import api from "../services/api";
import { useThemeMode } from "../App";

const actionConfig = {
  UPLOAD:               { icon: "↑", color: "#10b981", bg: "rgba(16,185,129,0.1)"  },
  DOWNLOAD:             { icon: "↓", color: "#0ea5e9", bg: "rgba(14,165,233,0.1)"  },
  SHARE:                { icon: "↗", color: "#7c3aed", bg: "rgba(124,58,237,0.1)"  },
  RECEIVED:             { icon: "↙", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  DELETE:               { icon: "×", color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
  DELETED_FOR_EVERYONE: { icon: "✕", color: "#dc2626", bg: "rgba(220,38,38,0.12)"  },
  FILE_REMOVED:         { icon: "!", color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  UNSHARE:              { icon: "↩", color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
};

const actionLabel = {
  UPLOAD:               "Uploaded",
  DOWNLOAD:             "Downloaded",
  SHARE:                "Shared",
  RECEIVED:             "Received",
  DELETE:               "Deleted",
  DELETED_FOR_EVERYONE: "Deleted for everyone",
  FILE_REMOVED:         "File removed by owner",
  UNSHARE:              "Removed",
};

function timeAgo(timestamp) {
  if (!timestamp) return "";
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

export default function AuditLogList({ refreshFlag }) {
  const { darkMode } = useThemeMode();
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack]     = useState({ open: false, message: "", severity: "info" });

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
    } catch {
      setSnack({ open: true, message: "Failed to clear.", severity: "error" });
    }
  };

  const textPri  = darkMode ? "rgba(241,240,255,0.75)" : "rgba(13,11,30,0.75)";
  const textSec  = darkMode ? "rgba(241,240,255,0.3)"  : "rgba(13,11,30,0.4)";
  const divColor = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";
  const namePri  = darkMode ? "#f1f0ff"                : "#0d0b1e";

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
      <CircularProgress size={20} sx={{ color: "#7c3aed" }} />
    </Box>
  );

  if (logs.length === 0) return (
    <Typography sx={{ fontSize: 13, color: textSec, py: 3, textAlign: "center" }}>
      No activity yet.
    </Typography>
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography sx={{ fontSize: 12, color: textSec }}>
          {logs.length} event{logs.length !== 1 ? "s" : ""}
        </Typography>
        <Box onClick={handleClear} sx={{
          fontSize: 11, cursor: "pointer", transition: "color 0.15s",
          color: darkMode ? "rgba(239,68,68,0.5)" : "rgba(220,38,38,0.6)",
          "&:hover": { color: "#ef4444" },
        }}>
          Clear all
        </Box>
      </Box>

      {logs.map((log, i) => {
        const cfg = actionConfig[log.action] || { icon: "·", color: "#9ca3af", bg: "rgba(156,163,175,0.1)" };
        const label = actionLabel[log.action] || log.action?.toLowerCase();

        return (
          <Box key={log.id || i} sx={{
            display: "flex", alignItems: "flex-start", gap: 1.5,
            py: 1.5,
            borderBottom: i < logs.length - 1 ? `0.5px solid ${divColor}` : "none",
          }}>
            <Box sx={{
              width: 26, height: 26, borderRadius: "7px", flexShrink: 0,
              background: cfg.bg, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 12, color: cfg.color, mt: "1px",
            }}>
              {cfg.icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, color: textPri }}>
                <Box component="span" sx={{ color: cfg.color, fontWeight: 600 }}>
                  {label}
                </Box>
                {" · "}
                <Box component="span" sx={{
                  color: namePri, fontWeight: 500,
                  maxWidth: 160, display: "inline-block",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  verticalAlign: "bottom",
                }}>
                  {log.target}
                </Box>
              </Typography>
              {log.details && (
                <Typography sx={{ fontSize: 11, color: textSec, mt: "1px" }}>
                  {log.details}
                </Typography>
              )}
              <Typography sx={{ fontSize: 11, color: textSec, mt: "2px" }}>
                {timeAgo(log.timestamp)}
              </Typography>
            </Box>
          </Box>
        );
      })}

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