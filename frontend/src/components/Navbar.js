import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { isLoggedIn, logout } from "../utils/auth";

export default function Navbar() {
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const username = localStorage.getItem("username");

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 3, md: 5 },
        py: "14px",
        background: "rgba(8,8,16,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "0.5px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
        onClick={() => (window.location.href = "/")}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "8px",
            background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 14px rgba(124,58,237,0.4)",
          }}
        >
          <Typography sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: "#fff" }}>
            E
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "#f1f0ff",
            letterSpacing: "0.02em",
          }}
        >
          Encryptify
        </Typography>
      </Box>

      {/* Right side */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {isLoggedIn() ? (
          <>
            <Box
              sx={{
                px: 2,
                py: "5px",
                borderRadius: "20px",
                background: "rgba(124,58,237,0.1)",
                border: "0.5px solid rgba(124,58,237,0.25)",
                display: { xs: "none", sm: "block" },
              }}
            >
              <Typography sx={{ fontSize: 12, color: "#a78bfa", fontWeight: 500 }}>{username}</Typography>
            </Box>
            <Button
              onClick={handleLogout}
              size="small"
              sx={{
                fontSize: 12,
                color: "rgba(248,113,113,0.8)",
                border: "0.5px solid rgba(248,113,113,0.2)",
                borderRadius: "8px",
                px: 2,
                py: "5px",
                "&:hover": { background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.4)" },
              }}
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button
              href="/login"
              size="small"
              sx={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                px: 2,
                "&:hover": { background: "rgba(255,255,255,0.04)", color: "#fff" },
              }}
            >
              Sign in
            </Button>
            <Button
              href="/register"
              size="small"
              variant="contained"
              sx={{ fontSize: 12, px: 2.5 }}
            >
              Get started
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}