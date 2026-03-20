import React, { useState, useMemo, createContext, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { isLoggedIn } from "./utils/auth";

const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

export const ThemeModeContext = createContext({ darkMode: true, toggleDarkMode: () => {} });
export const useThemeMode = () => useContext(ThemeModeContext);

const darkPalette = {
  mode: "dark",
  primary:    { main: "#7c3aed", light: "#a78bfa", dark: "#5b21b6", contrastText: "#fff" },
  secondary:  { main: "#0ea5e9", light: "#38bdf8", dark: "#0284c7", contrastText: "#fff" },
  background: { default: "#080810", paper: "#0f0f1a" },
  text:       { primary: "#f1f0ff", secondary: "rgba(241,240,255,0.45)", disabled: "rgba(241,240,255,0.2)" },
  divider:    "rgba(255,255,255,0.06)",
  error:      { main: "#f87171" },
  success:    { main: "#34d399" },
  info:       { main: "#38bdf8" },
};

const lightPalette = {
  mode: "light",
  primary:    { main: "#6d28d9", light: "#7c3aed", dark: "#4c1d95", contrastText: "#fff" },
  secondary:  { main: "#0284c7", light: "#0ea5e9", dark: "#075985", contrastText: "#fff" },
  background: { default: "#f5f3ff", paper: "#ffffff" },
  text:       { primary: "#0d0b1e", secondary: "rgba(13,11,30,0.55)", disabled: "rgba(13,11,30,0.3)" },
  divider:    "rgba(0,0,0,0.07)",
  error:      { main: "#dc2626" },
  success:    { main: "#059669" },
  info:       { main: "#0284c7" },
};

function buildTheme(dark) {
  const palette = dark ? darkPalette : lightPalette;
  return createTheme({
    palette,
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
          body: { background: dark ? "#080810" : "#f5f3ff", transition: "background 0.3s ease" },
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
            boxShadow: "0 0 20px rgba(124,58,237,0.2)",
            "&:hover": { boxShadow: "0 0 28px rgba(124,58,237,0.35)", transform: "translateY(-1px)" },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              "& fieldset": { borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)" },
              "&:hover fieldset": { borderColor: "rgba(124,58,237,0.5)" },
              "&.Mui-focused fieldset": { borderColor: "#7c3aed", borderWidth: "1px" },
            },
            "& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#7c3aed" },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            background: dark ? "#0f0f1a" : "#ffffff",
            border: dark ? "0.5px solid rgba(255,255,255,0.06)" : "0.5px solid rgba(0,0,0,0.07)",
            transition: "background 0.3s ease, border-color 0.3s ease",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontFamily: "'DM Sans', sans-serif", fontWeight: 500 },
        },
      },
    },
  });
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("encryptify-theme");
    return saved ? saved === "dark" : true;
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("encryptify-theme", next ? "dark" : "light");
      return next;
    });
  };

  const theme = useMemo(() => buildTheme(darkMode), [darkMode]);

  return (
    <ThemeModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/"         element={isLoggedIn() ? <DashboardPage /> : <RegisterPage />} />
          <Route path="/login"    element={!isLoggedIn() ? <LoginPage />   : <Navigate to="/" replace />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}