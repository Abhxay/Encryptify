import React, { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import api from "../services/api";

const features = [
  { icon: "🔐", label: "AES-256 encryption", desc: "Military-grade cipher on every file" },
  { icon: "⚡", label: "Instant sharing", desc: "Share securely with any registered user" },
  { icon: "📋", label: "Full audit trail", desc: "Every action logged and traceable" },
];

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const show = (message, severity = "success", cb) => {
    setSnack({ open: true, message, severity });
    if (cb) setTimeout(cb, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { username, password });
      if (res.data?.success) {
        show(res.data.message, "success", () => (window.location.href = "/login"));
      } else {
        show("Registration failed, please try again.", "error");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        show("Username already taken. Try another.", "error");
      } else {
        show("Network error. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#080810", overflow: "hidden" }}>
      {/* Ambient glow blobs */}
      <Box sx={{
        position: "fixed", top: "10%", left: "20%", width: 500, height: 500,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
        pointerEvents: "none", filter: "blur(40px)",
      }} />
      <Box sx={{
        position: "fixed", top: "30%", right: "10%", width: 400, height: 400,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)",
        pointerEvents: "none", filter: "blur(40px)",
      }} />

      {/* HERO SECTION */}
      <Box sx={{
        maxWidth: 1100, mx: "auto", px: { xs: 3, md: 6 },
        pt: { xs: 6, md: 10 }, pb: { xs: 4, md: 6 },
        display: "flex", flexDirection: { xs: "column", md: "row" },
        alignItems: "center", gap: { xs: 6, md: 8 },
      }}>
        {/* Left — hero text */}
        <Box sx={{ flex: 1 }}>
          {/* Eyebrow badge */}
          <Box sx={{
            display: "inline-flex", alignItems: "center", gap: 1,
            px: 2, py: "6px", borderRadius: "20px",
            background: "rgba(124,58,237,0.1)", border: "0.5px solid rgba(124,58,237,0.25)",
            mb: 3,
          }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed",
              boxShadow: "0 0 6px #7c3aed",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 },
              },
            }} />
            <Typography sx={{ fontSize: 12, color: "#a78bfa", fontWeight: 500, letterSpacing: "0.05em" }}>
              AES-256 · End-to-end encrypted
            </Typography>
          </Box>

          <Typography variant="h1" sx={{
            fontSize: { xs: 36, md: 52 }, lineHeight: 1.1,
            letterSpacing: "-0.03em", color: "#f1f0ff", mb: 2,
          }}>
            Your files,{" "}
            <Box component="span" sx={{
              background: "linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              vault-grade secure
            </Box>
          </Typography>

          <Typography sx={{
            fontSize: { xs: 15, md: 17 }, color: "rgba(241,240,255,0.45)",
            lineHeight: 1.7, mb: 5, maxWidth: 440, fontWeight: 300,
          }}>
            Upload, share, and manage files with military-grade encryption.
            Every file encrypted before storage — only you hold the keys.
          </Typography>

          {/* Feature list */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {features.map((f) => (
              <Box key={f.label} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: "10px", flexShrink: 0,
                  background: "rgba(124,58,237,0.08)", border: "0.5px solid rgba(124,58,237,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                }}>
                  {f.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, color: "#f1f0ff", fontWeight: 500 }}>{f.label}</Typography>
                  <Typography sx={{ fontSize: 12, color: "rgba(241,240,255,0.35)" }}>{f.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right — register form */}
        <Box sx={{
          width: { xs: "100%", md: 380 }, flexShrink: 0,
          background: "rgba(255,255,255,0.025)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: "16px", p: { xs: 3, md: 4 },
          backdropFilter: "blur(12px)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.06)",
        }}>
          <Typography variant="h5" sx={{ mb: 0.5, color: "#f1f0ff", letterSpacing: "-0.01em" }}>
            Create your account
          </Typography>
          <Typography sx={{ fontSize: 13, color: "rgba(241,240,255,0.35)", mb: 3 }}>
            Free forever. No credit card needed.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Username" value={username}
              onChange={(e) => setUsername(e.target.value)}
              required sx={{ mb: 2 }} size="small"
              inputProps={{ style: { fontFamily: "'DM Sans', sans-serif" } }}
            />
            <TextField
              fullWidth label="Password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              required sx={{ mb: 3 }} size="small"
              inputProps={{ style: { fontFamily: "'DM Sans', sans-serif" } }}
            />
            <Button
              type="submit" variant="contained" fullWidth disabled={loading}
              sx={{ py: 1.2, fontSize: 14, fontWeight: 500 }}
            >
              {loading ? "Creating account..." : "Create free account →"}
            </Button>
          </Box>

          <Typography sx={{ fontSize: 12, color: "rgba(241,240,255,0.3)", textAlign: "center", mt: 2.5 }}>
            Already have an account?{" "}
            <Box component="a" href="/login" sx={{ color: "#a78bfa", textDecoration: "none",
              "&:hover": { textDecoration: "underline" } }}>
              Sign in
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* Bottom gradient fade */}
      <Box sx={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: 120,
        background: "linear-gradient(to top, #080810, transparent)",
        pointerEvents: "none",
      }} />

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