import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";
import AuditLogList from "../components/AuditLogList";
import StorageBar from "../components/StorageBar";
import api from "../services/api";
import { useThemeMode } from "../App";

function StatCard({ value, label, accent, darkMode }) {
  return (
    <Box sx={{
      background: darkMode ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.8)",
      border: "0.5px solid",
      borderColor: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
      borderRadius: "12px", p: 2.5,
      transition: "all 0.2s",
      "&:hover": { borderColor: accent, background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(124,58,237,0.04)" },
    }}>
      <Typography sx={{
        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 28,
        color: darkMode ? "#f1f0ff" : "#0d0b1e", lineHeight: 1,
      }}>
        {value}
      </Typography>
      <Typography sx={{
        fontSize: 11, mt: 0.5,
        color: darkMode ? "rgba(241,240,255,0.35)" : "rgba(13,11,30,0.45)",
        textTransform: "uppercase", letterSpacing: "0.08em",
        display: "flex", alignItems: "center", gap: 0.8,
      }}>
        <Box component="span" sx={{ width: 5, height: 5, borderRadius: "50%",
          background: accent, display: "inline-block" }} />
        {label}
      </Typography>
    </Box>
  );
}

export default function DashboardPage() {
  const { darkMode } = useThemeMode();
  const [refreshFlag, setRefreshFlag]   = useState(false);
  const [encryptedCount, setEncryptedCount] = useState(0);
  const [sharedCount, setSharedCount]       = useState(0);
  const [storage, setStorage]               = useState(null);

  const username = localStorage.getItem("username") || "there";
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const triggerRefresh = () => setRefreshFlag(f => !f);

  useEffect(() => {
    api.get("/file/list").then(res => {
      const files = Array.isArray(res.data) ? res.data : [];
      setEncryptedCount(files.length);
      setSharedCount(files.filter(f => f.sharedByYou).length);
    }).catch(() => {});

    api.get("/user/storage").then(res => setStorage(res.data)).catch(() => {});
  }, [refreshFlag]);

  const bg       = darkMode ? "#080810" : "#f5f3ff";
  const textPri  = darkMode ? "#f1f0ff" : "#0d0b1e";
  const textSec  = darkMode ? "rgba(241,240,255,0.35)" : "rgba(13,11,30,0.45)";
  const panelHdr = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";

  return (
    <Box sx={{ minHeight: "100vh", background: bg, transition: "background 0.3s" }}>
      <Box sx={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 400, pointerEvents: "none",
        background: darkMode
          ? "radial-gradient(ellipse at top, rgba(124,58,237,0.07) 0%, transparent 70%)"
          : "radial-gradient(ellipse at top, rgba(124,58,237,0.05) 0%, transparent 70%)",
      }} />

      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>

        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ color: textPri, letterSpacing: "-0.02em", mb: 0.5 }}>
              {greeting}, {username}
            </Typography>
            <Typography sx={{ fontSize: 13, color: textSec }}>
              Your vault is secure · all files encrypted at rest
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{
              width: 7, height: 7, borderRadius: "50%", background: "#34d399",
              boxShadow: "0 0 8px #34d399",
              animation: "pulse 3s infinite",
              "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } },
            }} />
            <Typography sx={{ fontSize: 12, color: textSec }}>All systems operational</Typography>
          </Box>
        </Box>

        {/* Stats */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, mb: 3 }}>
          <StatCard value={encryptedCount} label="Encrypted files" accent="#a78bfa" darkMode={darkMode} />
          <StatCard value={sharedCount}    label="Files shared"    accent="#38bdf8" darkMode={darkMode} />
          <StatCard
            value={storage && storage.usedMB != null ? `${storage.usedMB} MB` : "— MB"}
            label="Storage used"
            accent={
              storage?.percentUsed >= 90 ? "#ef4444" :
              storage?.percentUsed >= 75 ? "#f59e0b" : "#34d399"
            }
            darkMode={darkMode}
          />
        </Box>

        {/* Storage bar — full width, between stats and panels */}
        <StorageBar refreshFlag={refreshFlag} darkMode={darkMode} />

        {/* Panels */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" },
          gap: 3, alignItems: "flex-start" }}>

          <Box sx={{ flex: "0 0 auto", width: { xs: "100%", lg: "540px" } }}>
            <Paper sx={{ borderRadius: "14px", overflow: "hidden" }}>
              <Box sx={{ px: 3, pt: 2.5, pb: 1.5, background: panelHdr,
                borderBottom: "0.5px solid",
                borderColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)" }}>
                <Typography sx={{ fontSize: 11, fontWeight: 500, color: textSec,
                  textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Your vault
                </Typography>
              </Box>
              <Box sx={{ p: 3, pt: 2 }}>
                {/* Pass usedMB to FileUpload so it can check before uploading */}
                <FileUpload refresh={triggerRefresh} usedMB={storage?.usedMB || 0} />
                <Box sx={{ mt: 2.5 }}>
                  <FileList refreshFlag={refreshFlag} triggerRefresh={triggerRefresh} />
                </Box>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper sx={{ borderRadius: "14px", overflow: "hidden" }}>
              <Box sx={{ px: 3, pt: 2.5, pb: 1.5, background: panelHdr,
                borderBottom: "0.5px solid",
                borderColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)" }}>
                <Typography sx={{ fontSize: 11, fontWeight: 500, color: textSec,
                  textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Activity
                </Typography>
              </Box>
              <Box sx={{ p: 3, pt: 2 }}>
                <AuditLogList refreshFlag={refreshFlag} />
              </Box>
            </Paper>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}