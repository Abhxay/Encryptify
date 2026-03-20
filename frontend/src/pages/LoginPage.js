import React, { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import api from "../services/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const show = (message, severity = "success", cb) => {
    setSnack({ open: true, message, severity });
    if (cb) setTimeout(cb, 1800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      const { token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      show("Welcome back! Redirecting...", "success", () => (window.location.href = "/"));
    } catch {
      show("Invalid credentials. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh", background: "#080810",
      display: "flex", alignItems: "center", justifyContent: "center",
      px: 3, position: "relative", overflow: "hidden",
    }}>
      {/* Glow blobs */}
      <Box sx={{ position: "fixed", top: "15%", left: "30%", width: 500, height: 500,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
        pointerEvents: "none", filter: "blur(40px)" }} />
      <Box sx={{ position: "fixed", bottom: "20%", right: "20%", width: 350, height: 350,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
        pointerEvents: "none", filter: "blur(40px)" }} />

      <Box sx={{
        width: "100%", maxWidth: 380,
        background: "rgba(255,255,255,0.025)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: "16px", p: 4,
        boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
      }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
          <Box sx={{
            width: 28, height: 28, borderRadius: "7px",
            background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 12px rgba(124,58,237,0.4)",
          }}>
            <Typography sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: "#fff" }}>E</Typography>
          </Box>
          <Typography sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#f1f0ff" }}>
            Encryptify
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ mb: 0.5, color: "#f1f0ff", letterSpacing: "-0.01em" }}>
          Welcome back
        </Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(241,240,255,0.35)", mb: 3 }}>
          Sign in to your encrypted vault
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Username" value={username}
            onChange={(e) => setUsername(e.target.value)}
            required size="small" sx={{ mb: 2 }}
            inputProps={{ style: { fontFamily: "'DM Sans', sans-serif" } }} />
          <TextField fullWidth label="Password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required size="small" sx={{ mb: 3 }}
            inputProps={{ style: { fontFamily: "'DM Sans', sans-serif" } }} />
          <Button type="submit" variant="contained" fullWidth disabled={loading}
            sx={{ py: 1.2, fontSize: 14 }}>
            {loading ? "Signing in..." : "Sign in →"}
          </Button>
        </Box>

        <Typography sx={{ fontSize: 12, color: "rgba(241,240,255,0.3)", textAlign: "center", mt: 2.5 }}>
          No account yet?{" "}
          <Box component="a" href="/register" sx={{ color: "#a78bfa", textDecoration: "none",
            "&:hover": { textDecoration: "underline" } }}>
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