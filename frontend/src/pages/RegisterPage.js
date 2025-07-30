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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LockIcon from "@mui/icons-material/Lock";
import Box from "@mui/material/Box";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const showMessage = (message, severity = "success", cb) => {
    setSnack({ open: true, message, severity });
    setTimeout(() => {
      setSnack((s) => ({ ...s, open: false }));
      if (cb) cb();
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { username, password });
      if (res.data?.success) {
        showMessage(res.data.message, "success", () => {
          window.location.href = "/login";
        });
      } else {
        showMessage("Registration failed, please try again.", "error");
      }
    } catch (error) {
      if (error.response) {
        if (
          error.response.status === 409 ||
          (error.response.data?.message && error.response.data.message.toLowerCase().includes("username"))
        ) {
          showMessage("Username is already taken. Please choose another.", "error");
        } else {
          showMessage("Registration failed. Please try again.", "error");
        }
      } else {
        showMessage("Network error. Please try again.", "error");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Card sx={{ boxShadow: 6, bgcolor: "background.paper" }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3} alignItems="center">
              <Typography variant="h5" fontWeight={700} color="primary" sx={{ mt: 1 }}>
                Register
              </Typography>
              <TextField
                fullWidth
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                InputProps={{ startAdornment: <PersonAddIcon sx={{ color: "primary.main" }} /> }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                InputProps={{ startAdornment: <LockIcon sx={{ color: "primary.main" }} /> }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontWeight: 700, boxShadow: 2, mt: 2 }}
              >
                Register
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
