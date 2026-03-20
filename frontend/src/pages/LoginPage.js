import React, { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import api from "../services/api";
import { useThemeMode } from "../App";
import { EncryptifyMark } from "../components/EncryptifyLogo";

export default function LoginPage() {
  const { darkMode } = useThemeMode();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [snack, setSnack]       = useState({ open: false, message: "", severity: "success" });

  const show = (message, severity = "success", cb) => {
    setSnack({ open: true, message, severity });
    if (cb) setTimeout(cb, 1800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", username);
      show("Welcome back! Redirecting...", "success", () => (window.location.href = "/"));
    } catch {
      show("Invalid credentials. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const bg      = darkMode ? "#080810" : "#f5f3ff";
  const cardBg  = darkMode ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.95)";
  const cardBdr = darkMode ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.08)";
  const textPri = darkMode ? "#f1f0ff" : "#0d0b1e";
  const textSec = darkMode ? "rgba(241,240,255,0.4)" : "rgba(13,11,30,0.5)";

  return (
    <Box sx={{
      minHeight: "100vh", background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      px: 3, transition: "background 0.3s", position: "relative", overflow: "hidden",
    }}>
      {/* Blobs */}
      <Box sx={{ position: "fixed", top: "15%", left: "28%", width: 500, height: 500,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)",
        pointerEvents: "none", filter: "blur(50px)" }} />
      <Box sx={{ position: "fixed", bottom: "15%", right: "18%", width: 350, height: 350,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)",
        pointerEvents: "none", filter: "blur(45px)" }} />

      <Box sx={{
        width: "100%", maxWidth: 370,
        background: cardBg, border: `0.5px solid ${cardBdr}`,
        borderRadius: "16px", p: 4,
        boxShadow: darkMode
          ? "0 24px 64px rgba(0,0,0,0.45)"
          : "0 12px 40px rgba(109,40,217,0.1)",
        backdropFilter: "blur(16px)",
        transition: "background 0.3s, box-shadow 0.3s",
      }}>
        <Box sx={{ mb: 3.5 }}>
          <EncryptifyMark size={36} darkMode={darkMode} />
        </Box>

        <Typography variant="h5" sx={{ mb: 0.5, color: textPri, letterSpacing: "-0.01em" }}>
          Welcome back
        </Typography>
        <Typography sx={{ fontSize: 13, color: textSec, mb: 3 }}>
          Sign in to your encrypted vault
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Username" value={username}
            onChange={e => setUsername(e.target.value)}
            required size="small" sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            required size="small" sx={{ mb: 3 }} />
          <Button type="submit" variant="contained" fullWidth disabled={loading}
            sx={{ py: 1.2, fontSize: 14 }}>
            {loading ? "Signing in..." : "Sign in →"}
          </Button>
        </Box>

        <Typography sx={{ fontSize: 12, color: textSec, textAlign: "center", mt: 2.5 }}>
          No account yet?{" "}
          <Box component="a" href="/register"
            sx={{ color: "#a78bfa", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
            Create one free
          </Box>
        </Typography>
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