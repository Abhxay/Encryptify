import React from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import { isLoggedIn, logout } from "../utils/auth";
import { useThemeMode } from "../App";
import EncryptifyLogoFull, { EncryptifyMark } from "./EncryptifyLogo";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useThemeMode();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: { xs: 3, md: 5 }, py: "13px",
        background: darkMode ? "rgba(8,8,16,0.88)" : "rgba(245,243,255,0.88)",
        backdropFilter: "blur(16px)",
        borderBottom: "0.5px solid",
        borderColor: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Logo */}
      <Box
        sx={{ cursor: "pointer" }}
        onClick={() => (window.location.href = "/")}
      >
        <EncryptifyLogoFull iconSize={30} darkMode={darkMode} />
      </Box>

      {/* Right controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>

        {/* Theme toggle */}
        <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
          <Box
            onClick={toggleDarkMode}
            sx={{
              width: 34, height: 34, borderRadius: "9px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "0.5px solid",
              borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "#7c3aed",
                color: "#7c3aed",
                background: "rgba(124,58,237,0.08)",
              },
            }}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </Box>
        </Tooltip>

        {isLoggedIn() ? (
          <>
            <Box sx={{
              px: 2, py: "5px", borderRadius: "20px",
              background: "rgba(124,58,237,0.1)",
              border: "0.5px solid rgba(124,58,237,0.25)",
              display: { xs: "none", sm: "block" },
            }}>
              <Typography sx={{ fontSize: 12, color: "#a78bfa", fontWeight: 500 }}>
                {username}
              </Typography>
            </Box>
            <Button
              onClick={handleLogout}
              size="small"
              sx={{
                fontSize: 12, color: "rgba(248,113,113,0.85)",
                border: "0.5px solid rgba(248,113,113,0.2)",
                borderRadius: "8px", px: 2, py: "5px",
                "&:hover": { background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.4)" },
              }}
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button
              href="/login" size="small"
              sx={{
                fontSize: 12,
                color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                border: "0.5px solid",
                borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                borderRadius: "8px", px: 2,
                "&:hover": {
                  background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                  color: darkMode ? "#fff" : "#0d0b1e",
                },
              }}
            >
              Sign in
            </Button>
            <Button href="/register" size="small" variant="contained" sx={{ fontSize: 12, px: 2.5 }}>
              Get started
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}