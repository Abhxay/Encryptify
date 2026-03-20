import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import { isLoggedIn, logout } from "../utils/auth";
import { useThemeMode } from "../App";
import EncryptifyLogoFull from "./EncryptifyLogo";
import UserSettingsModal from "./UserSettingsModal";

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

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useThemeMode();
  const [username, setUsername]     = useState(localStorage.getItem("username") || "");
  const [dropOpen, setDropOpen]     = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);
  const dropRef                     = useRef(null);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dropBg  = darkMode ? "#131326"                : "#ffffff";
  const dropBdr = darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)";
  const itemHov = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const textPri = darkMode ? "#f1f0ff"                : "#0d0b1e";
  const textSec = darkMode ? "rgba(241,240,255,0.45)" : "rgba(13,11,30,0.5)";

  return (
    <>
      <Box
        component="nav"
        sx={{
          position: "sticky", top: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          px: { xs: 3, md: 5 }, py: "13px",
          background: darkMode ? "rgba(8,8,16,0.88)" : "rgba(245,243,255,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "0.5px solid",
          borderColor: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Logo */}
        <Box sx={{ cursor: "pointer" }} onClick={() => (window.location.href = "/")}>
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
                borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
                color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#7c3aed", color: "#7c3aed", background: "rgba(124,58,237,0.08)" },
              }}
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </Box>
          </Tooltip>

          {isLoggedIn() ? (
            <>
              {/* Username badge with dropdown */}
              <Box ref={dropRef} sx={{ position: "relative", display: { xs: "none", sm: "block" } }}>
                <Box
                  onClick={() => setDropOpen(o => !o)}
                  sx={{
                    px: 2, py: "6px", borderRadius: "20px",
                    background: "rgba(124,58,237,0.1)",
                    border: "0.5px solid",
                    borderColor: dropOpen ? "rgba(124,58,237,0.5)" : "rgba(124,58,237,0.25)",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 1,
                    transition: "all 0.15s",
                    "&:hover": { borderColor: "rgba(124,58,237,0.5)", background: "rgba(124,58,237,0.14)" },
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: "#a78bfa", fontWeight: 500, lineHeight: 1 }}>
                    {username}
                  </Typography>
                  <Box sx={{
                    color: "#a78bfa", opacity: 0.7,
                    transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    display: "flex", alignItems: "center",
                  }}>
                    <ChevronDown />
                  </Box>
                </Box>

                {/* Dropdown */}
                {dropOpen && (
                  <Box sx={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    width: 200, background: dropBg,
                    border: `0.5px solid ${dropBdr}`,
                    borderRadius: "12px", overflow: "hidden",
                    boxShadow: darkMode
                      ? "0 16px 40px rgba(0,0,0,0.5)"
                      : "0 8px 24px rgba(109,40,217,0.12)",
                    zIndex: 101,
                    animation: "fadeIn 0.12s ease",
                    "@keyframes fadeIn": {
                      from: { opacity: 0, transform: "translateY(-4px)" },
                      to:   { opacity: 1, transform: "translateY(0)" },
                    },
                  }}>
                    {/* Header */}
                    <Box sx={{ px: 2, py: 1.5, borderBottom: `0.5px solid ${dropBdr}` }}>
                      <Typography sx={{ fontSize: 11, color: textSec, letterSpacing: "0.05em" }}>
                        Signed in as
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: textPri, fontWeight: 500, mt: 0.2 }}>
                        {username}
                      </Typography>
                    </Box>

                    {/* Menu items */}
                    <Box sx={{ py: 0.5 }}>
                      {[
                        { label: "Account settings", icon: "⚙", action: () => { setDropOpen(false); setModalOpen(true); } },
                      ].map(item => (
                        <Box
                          key={item.label}
                          onClick={item.action}
                          sx={{
                            px: 2, py: 1.2, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 1.5,
                            "&:hover": { background: itemHov },
                            transition: "background 0.1s",
                          }}
                        >
                          <Typography sx={{ fontSize: 14, lineHeight: 1 }}>{item.icon}</Typography>
                          <Typography sx={{ fontSize: 13, color: textPri, fontWeight: 500 }}>
                            {item.label}
                          </Typography>
                        </Box>
                      ))}

                      {/* Divider */}
                      <Box sx={{ height: "0.5px", background: dropBdr, mx: 2, my: 0.5 }} />

                      {/* Sign out */}
                      <Box
                        onClick={() => { setDropOpen(false); handleLogout(); }}
                        sx={{
                          px: 2, py: 1.2, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 1.5,
                          "&:hover": { background: "rgba(248,113,113,0.06)" },
                          transition: "background 0.1s",
                        }}
                      >
                        <Typography sx={{ fontSize: 14, lineHeight: 1 }}>→</Typography>
                        <Typography sx={{ fontSize: 13, color: "#f87171", fontWeight: 500 }}>
                          Sign out
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Mobile sign out */}
              <Button
                onClick={handleLogout}
                size="small"
                sx={{
                  display: { sm: "none" },
                  fontSize: 12, color: "rgba(248,113,113,0.85)",
                  border: "0.5px solid rgba(248,113,113,0.2)",
                  borderRadius: "8px", px: 2, py: "5px",
                  "&:hover": { background: "rgba(248,113,113,0.08)" },
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
                  color: darkMode ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
                  border: "0.5px solid",
                  borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
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

      {/* Settings modal */}
      {modalOpen && (
        <UserSettingsModal
          darkMode={darkMode}
          onClose={() => setModalOpen(false)}
          onUsernameChange={(newName) => setUsername(newName)}
        />
      )}
    </>
  );
}