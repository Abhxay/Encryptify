import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";
import AuditLogList from "../components/AuditLogList";
import api from "../services/api";

function StatCard({ value, label, color = "#7c3aed" }) {
  return (
    <Box sx={{
      background: "rgba(255,255,255,0.025)",
      border: "0.5px solid rgba(255,255,255,0.07)",
      borderRadius: "12px", p: 2.5,
      transition: "border-color 0.2s",
      "&:hover": { borderColor: "rgba(124,58,237,0.3)" },
    }}>
      <Typography sx={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: 28, color: "#f1f0ff", lineHeight: 1,
      }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 11, color: "rgba(241,240,255,0.35)", mt: 0.5,
        textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 0.8 }}>
        <Box component="span" sx={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block" }} />
        {label}
      </Typography>
    </Box>
  );
}

export default function DashboardPage() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [encryptedCount, setEncryptedCount] = useState(0);
  const [sharedCount, setSharedCount] = useState(0);
  const [totalSize, setTotalSize] = useState("0 KB");

  const username = localStorage.getItem("username") || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const triggerRefresh = () => setRefreshFlag(f => !f);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await api.get("/file/list");
        const files = Array.isArray(res.data) ? res.data : [];
        setEncryptedCount(files.length);
        setSharedCount(files.filter(f => f.sharedByYou).length);
        const bytes = files.reduce((sum, f) => sum + (f.sizeBytes || 0), 0);
        setTotalSize(bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`);
      } catch { /* silent */ }
    }
    fetchCounts();
  }, [refreshFlag]);

  return (
    <Box sx={{ minHeight: "100vh", background: "#080810" }}>
      {/* Subtle background glow */}
      <Box sx={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 400, pointerEvents: "none",
        background: "radial-gradient(ellipse at top, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />

      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>

        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ color: "#f1f0ff", letterSpacing: "-0.02em", mb: 0.5 }}>
              {greeting}, {username}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "rgba(241,240,255,0.35)" }}>
              Your vault is secure · all files encrypted at rest
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399",
              boxShadow: "0 0 8px #34d399",
              animation: "pulse 3s infinite",
              "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } },
            }} />
            <Typography sx={{ fontSize: 12, color: "rgba(241,240,255,0.35)" }}>All systems operational</Typography>
          </Box>
        </Box>

        {/* Stats row */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mb: 4 }}>
          <StatCard value={encryptedCount} label="Encrypted files" color="#a78bfa" />
          <StatCard value={sharedCount} label="Files shared" color="#38bdf8" />
          <StatCard value={totalSize} label="Total size" color="#34d399" />
        </Box>

        {/* Main panels */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3, alignItems: "flex-start" }}>

          {/* Files panel */}
          <Box sx={{ flex: "0 0 auto", width: { xs: "100%", lg: "540px" } }}>
            <Paper sx={{ borderRadius: "14px", overflow: "hidden" }}>
              <Box sx={{ px: 3, pt: 3, pb: 1.5, borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                <Typography sx={{ fontSize: 11, fontWeight: 500, color: "rgba(241,240,255,0.35)",
                  textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Your vault
                </Typography>
              </Box>
              <Box sx={{ p: 3, pt: 2 }}>
                <FileUpload refresh={triggerRefresh} />
                <Box sx={{ mt: 2.5 }}>
                  <FileList refreshFlag={refreshFlag} triggerRefresh={triggerRefresh} />
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Activity panel */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper sx={{ borderRadius: "14px", overflow: "hidden" }}>
              <Box sx={{ px: 3, pt: 3, pb: 1.5, borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                <Typography sx={{ fontSize: 11, fontWeight: 500, color: "rgba(241,240,255,0.35)",
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