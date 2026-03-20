import React, { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import api from "../services/api";
import { useThemeMode } from "../App";
import { EncryptifyMark } from "../components/EncryptifyLogo";

const features = [
  { icon: "▦", label: "AES-256 encryption",  desc: "Military-grade cipher on every file"      },
  { icon: "↗", label: "Instant sharing",      desc: "Share securely with any registered user"  },
  { icon: "≡", label: "Full audit trail",     desc: "Every action logged and traceable"        },
];

export default function RegisterPage() {
  const { darkMode } = useThemeMode();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [snack, setSnack]       = useState({ open: false, message: "", severity: "success" });

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

  const bg      = darkMode ? "#080810" : "#f5f3ff";
  const blob1   = darkMode ? "rgba(124,58,237,0.12)"  : "rgba(124,58,237,0.07)";
  const blob2   = darkMode ? "rgba(14,165,233,0.10)"  : "rgba(14,165,233,0.06)";
  const cardBg  = darkMode ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.9)";
  const cardBdr = darkMode ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.08)";
  const featBg  = darkMode ? "rgba(124,58,237,0.08)"   : "rgba(124,58,237,0.06)";
  const featBdr = darkMode ? "rgba(124,58,237,0.18)"   : "rgba(124,58,237,0.2)";
  const textPri = darkMode ? "#f1f0ff"                 : "#0d0b1e";
  const textSec = darkMode ? "rgba(241,240,255,0.45)"  : "rgba(13,11,30,0.5)";

  return (
    <Box sx={{ minHeight: "100vh", background: bg, overflow: "hidden", transition: "background 0.3s" }}>

      {/* Ambient blobs */}
      <Box sx={{ position: "fixed", top: "8%", left: "18%", width: 500, height: 500,
        borderRadius: "50%", background: `radial-gradient(circle, ${blob1} 0%, transparent 70%)`,
        pointerEvents: "none", filter: "blur(50px)" }} />
      <Box sx={{ position: "fixed", top: "35%", right: "8%", width: 380, height: 380,
        borderRadius: "50%", background: `radial-gradient(circle, ${blob2} 0%, transparent 70%)`,
        pointerEvents: "none", filter: "blur(45px)" }} />

      <Box sx={{
        maxWidth: 1100, mx: "auto", px: { xs: 3, md: 6 },
        pt: { xs: 6, md: 10 }, pb: 8,
        display: "flex", flexDirection: { xs: "column", md: "row" },
        alignItems: "center", gap: { xs: 6, md: 8 },
      }}>

        {/* LEFT: hero */}
        <Box sx={{ flex: 1 }}>
          {/* Eyebrow */}
          <Box sx={{
            display: "inline-flex", alignItems: "center", gap: 1,
            px: 2, py: "6px", borderRadius: "20px",
            background: "rgba(124,58,237,0.1)", border: "0.5px solid rgba(124,58,237,0.25)", mb: 3,
          }}>
            <Box sx={{
              width: 6, height: 6, borderRadius: "50%", background: "#7c3aed",
              boxShadow: "0 0 6px #7c3aed",
              animation: "blink 2s infinite",
              "@keyframes blink": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } },
            }} />
            <Typography sx={{ fontSize: 12, color: "#a78bfa", fontWeight: 500, letterSpacing: "0.05em" }}>
              AES-256 · End-to-end encrypted
            </Typography>
          </Box>

          <Typography variant="h1" sx={{
            fontSize: { xs: 34, md: 50 }, lineHeight: 1.1,
            letterSpacing: "-0.03em", color: textPri, mb: 2,
          }}>
            Your files,{" "}
            <Box component="span" sx={{
              background: "linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              vault-grade secure
            </Box>
          </Typography>

          <Typography sx={{ fontSize: { xs: 15, md: 16 }, color: textSec,
            lineHeight: 1.75, mb: 5, maxWidth: 420, fontWeight: 300 }}>
            Upload, share, and manage files with military-grade encryption.
            Every file encrypted before storage — only you hold the keys.
          </Typography>

          {/* Feature chips */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {features.map((f) => (
              <Box key={f.label} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: "10px", flexShrink: 0,
                  background: featBg, border: `0.5px solid ${featBdr}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, color: "#a78bfa",
                }}>
                  {f.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, color: textPri, fontWeight: 500 }}>{f.label}</Typography>
                  <Typography sx={{ fontSize: 12, color: textSec }}>{f.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* RIGHT: form card */}
        <Box sx={{
          width: { xs: "100%", md: 370 }, flexShrink: 0,
          background: cardBg,
          border: `0.5px solid ${cardBdr}`,
          borderRadius: "16px", p: { xs: 3, md: 4 },
          backdropFilter: "blur(16px)",
          boxShadow: darkMode
            ? "0 24px 64px rgba(0,0,0,0.45)"
            : "0 12px 40px rgba(109,40,217,0.1)",
          transition: "background 0.3s, box-shadow 0.3s",
        }}>
          <Box sx={{ mb: 3 }}>
            <EncryptifyMark size={36} darkMode={darkMode} />
          </Box>

          <Typography variant="h5" sx={{ mb: 0.5, color: textPri, letterSpacing: "-0.01em" }}>
            Create your account
          </Typography>
          <Typography sx={{ fontSize: 13, color: textSec, mb: 3 }}>
            Free forever. No credit card needed.
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
              {loading ? "Creating account..." : "Create free account →"}
            </Button>
          </Box>

          <Typography sx={{ fontSize: 12, color: textSec, textAlign: "center", mt: 2.5 }}>
            Already have an account?{" "}
            <Box component="a" href="/login"
              sx={{ color: "#a78bfa", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              Sign in
            </Box>
          </Typography>
        </Box>
      </Box>

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