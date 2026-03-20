import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { isLoggedIn } from "./utils/auth";

// Google Fonts injected globally
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const darkPalette = {
  mode: "dark",
  primary: { main: "#7c3aed", light: "#a78bfa", dark: "#5b21b6", contrastText: "#fff" },
  secondary: { main: "#0ea5e9", light: "#38bdf8", dark: "#0284c7", contrastText: "#fff" },
  background: { default: "#080810", paper: "#0f0f1a" },
  text: { primary: "#f1f0ff", secondary: "rgba(241,240,255,0.45)", disabled: "rgba(241,240,255,0.2)" },
  divider: "rgba(255,255,255,0.06)",
  error: { main: "#f87171" },
  success: { main: "#34d399" },
  info: { main: "#38bdf8" },
};

export default function App() {
  const theme = useMemo(
    () =>
      createTheme({
        palette: darkPalette,
        shape: { borderRadius: 10 },
        typography: {
          fontFamily: "'DM Sans', sans-serif",
          h1: { fontFamily: "'Syne', sans-serif", fontWeight: 800 },
          h2: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
          h3: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
          h4: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
          h5: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
          h6: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
          button: { textTransform: "none", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              "*": { scrollbarWidth: "thin", scrollbarColor: "rgba(124,58,237,0.3) transparent" },
              "*::-webkit-scrollbar": { width: "4px" },
              "*::-webkit-scrollbar-thumb": { background: "rgba(124,58,237,0.3)", borderRadius: "4px" },
              body: { background: "#080810" },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.01em",
                transition: "all 0.2s ease",
              },
              containedPrimary: {
                background: "linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)",
                boxShadow: "0 0 20px rgba(124,58,237,0.25)",
                "&:hover": { boxShadow: "0 0 28px rgba(124,58,237,0.4)", transform: "translateY(-1px)" },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                  "&:hover fieldset": { borderColor: "rgba(124,58,237,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#7c3aed", borderWidth: "1px" },
                },
                "& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.35)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#a78bfa" },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                background: "#0f0f1a",
                border: "0.5px solid rgba(255,255,255,0.06)",
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: { fontFamily: "'DM Sans', sans-serif", fontWeight: 500 },
            },
          },
        },
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={isLoggedIn() ? <DashboardPage /> : <RegisterPage />} />
        <Route path="/login" element={!isLoggedIn() ? <LoginPage /> : <Navigate to="/" replace />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </ThemeProvider>
  );
}