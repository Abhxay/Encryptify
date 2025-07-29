import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LoginIcon from "@mui/icons-material/Person";
import RegisterIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import { isLoggedIn, logout } from "../utils/auth";

function Navbar({ toggleTheme, darkMode }) {
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <AppBar
      position="static"
      elevation={8}
      sx={{
        background: darkMode
          ? "linear-gradient(90deg, #232b41 0%, #454595 100%)"
          : "linear-gradient(90deg, #183eb0 0%, #13c2c2 100%)",
        px: 2,
      }}
    >
      <Toolbar>
        {/* NAVBAR LOGO: use pic.png */}
        <Box
          component="img"
          src={process.env.PUBLIC_URL + "/pic.png"}
          alt="Navbar Logo"
          sx={{
            height: 44,
            width: 44,
            mr: 2,
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: "#fff",
            p: 0.5,
            cursor: "pointer",
            userSelect: "none",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: 6 },
          }}
          onClick={() => window.location.href = "/"}
          draggable={false}
        />
        <Typography
          variant="h5"
          component="div"
          fontWeight={900}
          sx={{
            color: "#fff",
            userSelect: "none",
            pointerEvents: "none",
            letterSpacing: 2,
            textShadow: "0 2px 8px #154a9e72",
            display: { xs: "none", sm: "block" },
          }}
        >
          Encryptify
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title={darkMode ? "Light mode" : "Dark mode"}>
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mx: 2 }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
        {!isLoggedIn() && (
          <Fade in>
            <Box>
              <Button
                color="secondary"
                startIcon={<LoginIcon />}
                variant="contained"
                href="/login"
                sx={{
                  m: 1,
                  fontWeight: 700,
                  bgcolor: "white",
                  color: "primary.dark",
                  "&:hover": { bgcolor: "secondary.light", scale: "1.06" },
                }}
              >
                Login
              </Button>
              <Button
                color="secondary"
                startIcon={<RegisterIcon />}
                variant="contained"
                href="/register"
                sx={{
                  m: 1,
                  fontWeight: 700,
                  bgcolor: "white",
                  color: "primary.dark",
                  "&:hover": { bgcolor: "secondary.light", scale: "1.06" },
                }}
              >
                Register
              </Button>
            </Box>
          </Fade>
        )}
        {isLoggedIn() && (
          <Fade in>
            <Button
              color="error"
              startIcon={<LogoutIcon />}
              variant="contained"
              sx={{
                m: 1,
                fontWeight: 700,
                bgcolor: "white",
                color: "error.main",
                "&:hover": { bgcolor: "error.light", scale: "1.06" },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Fade>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
