import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Snackbar, Alert,
  Tabs, Tab, CircularProgress,
} from "@mui/material";
import api from "../services/api";

export default function UserSettingsModal({ darkMode, onClose, onUsernameChange }) {
  const [tab, setTab]               = useState(0);
  const [newUsername, setNewUsername] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass]         = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading]         = useState(false);
  const [snack, setSnack]             = useState({ open: false, message: "", severity: "success" });

  const show = (message, severity = "success") =>
    setSnack({ open: true, message, severity });

  const bg      = darkMode ? "#0f0f1a"                 : "#ffffff";
  const border  = darkMode ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.09)";
  const textPri = darkMode ? "#f1f0ff"                 : "#0d0b1e";
  const textSec = darkMode ? "rgba(241,240,255,0.45)"  : "rgba(13,11,30,0.5)";
  const overlay = darkMode ? "rgba(0,0,0,0.6)"         : "rgba(0,0,0,0.3)";

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return show("Username cannot be empty.", "error");
    setLoading(true);
    try {
      const res = await api.patch("/user/username", { newUsername: newUsername.trim() });
      if (res.data?.success) {
        localStorage.setItem("username", newUsername.trim());
        show("Username updated! Please sign in again.", "success");
        onUsernameChange?.(newUsername.trim());
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          window.location.href = "/login";
        }, 2000);
      } else {
        show(res.data?.message || "Update failed.", "error");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Username already taken or error occurred.";
      show(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPass.length < 6) return show("New password must be at least 6 characters.", "error");
    if (newPass !== confirmPass) return show("Passwords do not match.", "error");
    setLoading(true);
    try {
      const res = await api.patch("/user/password", {
        currentPassword: currentPass,
        newPassword: newPass,
      });
      if (res.data?.success) {
        show("Password updated! Please sign in again.", "success");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          window.location.href = "/login";
        }, 2000);
      } else {
        show(res.data?.message || "Update failed.", "error");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Current password incorrect.";
      show(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: "fixed", inset: 0, zIndex: 200,
          background: overlay, backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <Box sx={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 201, width: { xs: "calc(100vw - 40px)", sm: 400 },
        background: bg, border: `0.5px solid ${border}`,
        borderRadius: "16px",
        boxShadow: darkMode
          ? "0 32px 80px rgba(0,0,0,0.6)"
          : "0 16px 48px rgba(109,40,217,0.15)",
        overflow: "hidden",
      }}>

        {/* Header */}
        <Box sx={{
          px: 3, pt: 3, pb: 2,
          borderBottom: `0.5px solid ${border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: textPri,
              fontFamily: "'Syne', sans-serif" }}>
              Account settings
            </Typography>
            <Typography sx={{ fontSize: 12, color: textSec, mt: 0.3 }}>
              {localStorage.getItem("username")}
            </Typography>
          </Box>
          <Box
            onClick={onClose}
            sx={{
              width: 28, height: 28, borderRadius: "7px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: textSec, fontSize: 16,
              "&:hover": { background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: textPri },
            }}
          >
            ×
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ px: 3, pt: 1 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              minHeight: 36,
              "& .MuiTabs-indicator": { background: "#7c3aed", height: "2px" },
              "& .MuiTab-root": {
                minHeight: 36, fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500, textTransform: "none", px: 0, mr: 3,
                color: textSec,
                "&.Mui-selected": { color: "#a78bfa" },
              },
            }}
          >
            <Tab label="Change username" />
            <Tab label="Change password" />
          </Tabs>
        </Box>

        {/* Tab content */}
        <Box sx={{ px: 3, pt: 2.5, pb: 3 }}>

          {/* USERNAME TAB */}
          {tab === 0 && (
            <Box component="form" onSubmit={handleUsernameSubmit}>
              <Typography sx={{ fontSize: 12, color: textSec, mb: 2, lineHeight: 1.6 }}>
                Your new username must be unique. You'll be signed out after changing it.
              </Typography>
              <TextField
                fullWidth label="New username" size="small"
                value={newUsername} onChange={e => setNewUsername(e.target.value)}
                required sx={{ mb: 2.5 }}
                inputProps={{ style: { fontFamily: "'DM Sans', sans-serif" } }}
              />
              <Button
                type="submit" variant="contained" fullWidth
                disabled={loading || !newUsername.trim()}
                sx={{ py: 1.1, fontSize: 13 }}
              >
                {loading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Update username →"}
              </Button>
            </Box>
          )}

          {/* PASSWORD TAB */}
          {tab === 1 && (
            <Box component="form" onSubmit={handlePasswordSubmit}>
              <Typography sx={{ fontSize: 12, color: textSec, mb: 2, lineHeight: 1.6 }}>
                Enter your current password, then choose a new one (min. 6 characters).
              </Typography>
              <TextField
                fullWidth label="Current password" type="password" size="small"
                value={currentPass} onChange={e => setCurrentPass(e.target.value)}
                required sx={{ mb: 2 }}
                inputProps={{ style: { fontFamily: "'DM Sans', sans-serif" } }}
              />
              <TextField
                fullWidth label="New password" type="password" size="small"
                value={newPass} onChange={e => setNewPass(e.target.value)}
                required sx={{ mb: 2 }}
                inputProps={{ style: { fontFamily: "'DM Sans', sans-serif" } }}
              />
              <TextField
                fullWidth label="Confirm new password" type="password" size="small"
                value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                required
                error={confirmPass.length > 0 && confirmPass !== newPass}
                helperText={confirmPass.length > 0 && confirmPass !== newPass ? "Passwords don't match" : ""}
                sx={{ mb: 2.5 }}
                inputProps={{ style: { fontFamily: "'DM Sans', sans-serif" } }}
              />
              <Button
                type="submit" variant="contained" fullWidth
                disabled={loading || !currentPass || !newPass || !confirmPass}
                sx={{ py: 1.1, fontSize: 13 }}
              >
                {loading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Update password →"}
              </Button>
            </Box>
          )}

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
    </>
  );
}