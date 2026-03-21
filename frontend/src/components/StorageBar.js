import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import api from "../services/api";

export default function StorageBar({ refreshFlag, darkMode }) {
  const [storage, setStorage] = useState(null);

  useEffect(() => {
    api.get("/user/storage")
      .then(res => setStorage(res.data))
      .catch(() => {});
  }, [refreshFlag]);

  if (!storage) return null;

  const pct     = storage.percentUsed;
  const color   = pct >= 90 ? "#ef4444" : pct >= 75 ? "#f59e0b" : "#10b981";
  const bgTrack = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const textPri = darkMode ? "#f1f0ff"                : "#0d0b1e";
  const textSec = darkMode ? "rgba(241,240,255,0.4)"  : "rgba(13,11,30,0.45)";

  return (
    <Box sx={{
      mb: 3, px: 2.5, py: 2,
      background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.7)",
      border: "0.5px solid",
      borderColor: pct >= 90
        ? "rgba(239,68,68,0.3)"
        : pct >= 75
        ? "rgba(245,158,11,0.25)"
        : darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",
      borderRadius: "12px",
      transition: "border-color 0.3s",
    }}>
      {/* Top row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 500, color: textSec,
            textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Storage
          </Typography>
          {pct >= 90 && (
            <Box sx={{
              px: "6px", py: "1px", borderRadius: "4px", fontSize: 10,
              background: "rgba(239,68,68,0.12)", border: "0.5px solid rgba(239,68,68,0.3)",
              color: "#ef4444", fontWeight: 600,
            }}>
              Almost full
            </Box>
          )}
          {pct >= 75 && pct < 90 && (
            <Box sx={{
              px: "6px", py: "1px", borderRadius: "4px", fontSize: 10,
              background: "rgba(245,158,11,0.1)", border: "0.5px solid rgba(245,158,11,0.3)",
              color: "#f59e0b", fontWeight: 600,
            }}>
              Running low
            </Box>
          )}
        </Box>
        <Typography sx={{ fontSize: 12, color: textPri, fontFamily: "'DM Mono',monospace" }}>
          {storage.usedMB} MB
          <Box component="span" sx={{ color: textSec }}> / {storage.limitMB} MB</Box>
        </Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={{ height: 5, borderRadius: 3, background: bgTrack, overflow: "hidden" }}>
        <Box sx={{
          height: "100%",
          width: `${Math.min(pct, 100)}%`,
          background: pct >= 90
            ? "linear-gradient(90deg, #ef4444, #dc2626)"
            : pct >= 75
            ? "linear-gradient(90deg, #f59e0b, #d97706)"
            : `linear-gradient(90deg, #10b981, ${color})`,
          borderRadius: 3,
          transition: "width 0.6s ease, background 0.3s ease",
          boxShadow: `0 0 6px ${color}66`,
        }} />
      </Box>

      {/* Bottom row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography sx={{ fontSize: 11, color: textSec }}>
          {storage.fileCount} file{storage.fileCount !== 1 ? "s" : ""} uploaded
        </Typography>
        <Typography sx={{ fontSize: 11, color: pct >= 75 ? color : textSec, fontWeight: pct >= 75 ? 500 : 400 }}>
          {pct}% used
        </Typography>
      </Box>

      {/* Warning messages */}
      {pct >= 90 && (
        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "0.5px solid rgba(239,68,68,0.15)" }}>
          <Typography sx={{ fontSize: 11, color: "#f87171", lineHeight: 1.6 }}>
            ⚠ Your vault is almost full. Delete some files to free up space. Max storage is {storage.limitMB} MB.
          </Typography>
        </Box>
      )}
      {pct >= 75 && pct < 90 && (
        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "0.5px solid rgba(245,158,11,0.15)" }}>
          <Typography sx={{ fontSize: 11, color: "#fbbf24", lineHeight: 1.6 }}>
            Storage is running low. You have {(storage.limitMB - storage.usedMB).toFixed(1)} MB remaining.
          </Typography>
        </Box>
      )}
    </Box>
  );
}