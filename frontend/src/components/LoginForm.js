import React, { useState } from "react";
import api from "../services/api";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Box from "@mui/material/Box";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const showMessage = (msg, severity = "success", cb) => {
    setSnack({ open: true, message: msg, severity });
    setTimeout(() => {
      setSnack((s) => ({ ...s, open: false }));
      if (typeof cb === "function") cb();
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      const { token, username: returnedUsername } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", returnedUsername || username);
      showMessage("Login successful! Redirecting...", "success", () => {
        window.location.href = "/";
      });
    } catch {
      showMessage("Login failed. Check your credentials.", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Card sx={{ boxShadow: 6, bgcolor: "background.paper" }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3} alignItems="center">
              <Typography variant="h5" fontWeight={700} color="primary" sx={{ mt: 1 }}>
                Login
              </Typography>
              <TextField
                fullWidth
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                InputProps={{
                  startAdornment: <PersonIcon sx={{ color: "primary.main" }} />,
                }}
                sx={{
                  "& .MuiInputBase-input": { color: (theme) => theme.palette.text.primary },
                  "& .MuiInputLabel-root": { color: (theme) => theme.palette.text.secondary },
                }}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                InputProps={{
                  startAdornment: <LockIcon sx={{ color: "primary.main" }} />,
                }}
                sx={{
                  "& .MuiInputBase-input": { color: (theme) => theme.palette.text.primary },
                  "& .MuiInputLabel-root": { color: (theme) => theme.palette.text.secondary },
                }}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontWeight: 700, boxShadow: 2, mt: 2 }}
              >
                Login
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        open={snack.open}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LoginForm;
