import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { isLoggedIn } from "./utils/auth";

const lightPalette = {
  mode: "light",
  primary: { main: "#183EB0", contrastText: "#fff" },
  secondary: { main: "#13C2C2", contrastText: "#000" },
  background: { default: "#f5f6fa", paper: "#fff" },
  text: { primary: "#222222", secondary: "#555555" },
};

const darkPalette = {
  mode: "dark",
  primary: { main: "#90caf9", contrastText: "#000" },
  secondary: { main: "#80deea", contrastText: "#000" },
  background: { default: "#121212", paper: "#1e2a43" },
  text: { primary: "#ffffff", secondary: "#b0bec5" },
  divider: "rgba(255,255,255,0.12)",
};

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: darkMode ? darkPalette : lightPalette,
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: "'Montserrat', 'Roboto', 'Arial', sans-serif",
          h1: { fontWeight: 900, letterSpacing: "-0.02em" },
          h2: { fontWeight: 800, letterSpacing: "-0.02em" },
          h3: { fontWeight: 700 },
          h5: { fontWeight: 700 },
          button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.03em" },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 24,
                boxShadow: "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: { transition: "background-color 0.3s ease" },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              colorPrimary: { transition: "background-color 0.3s ease" },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: { fontSize: 14 },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 700,
                borderRadius: 8,
                paddingLeft: 12,
                paddingRight: 12,
                textTransform: "capitalize",
              },
            },
          },
          MuiSnackbarContent: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const toggleTheme = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", JSON.stringify(!prev));
      return !prev;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/Encryptify">
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={isLoggedIn() ? <DashboardPage /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={!isLoggedIn() ? <LoginPage /> : <Navigate to="/" replace />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
