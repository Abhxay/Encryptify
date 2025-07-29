import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import InfoIcon from "@mui/icons-material/Info";
import api from "../services/api";

const actionIcon = (action) => {
  switch (action) {
    case "UPLOAD":
      return <CloudUploadIcon color="success" />;
    case "DOWNLOAD":
      return <DownloadIcon color="primary" />;
    case "DELETE":
      return <DeleteIcon color="error" />;
    case "SHARE":
      return <ShareIcon color="secondary" />;
    default:
      return <InfoIcon color="action" />;
  }
};

const parseTimestamp = (timestamp) => {
  if (!timestamp) return "Unknown time";
  const date = new Date(timestamp);
  if (isNaN(date)) return "Invalid Date";
  return date.toLocaleString();
};

export default function AuditLogList({ refreshFlag }) {
  const theme = useTheme();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/file/audit/mine");
        setLogs(Array.isArray(res.data) ? res.data.slice().reverse() : []);
      } catch (error) {
        setSnack({
          open: true,
          message: "Could not load activity history.",
          severity: "error",
        });
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [refreshFlag]);

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear your activity history?")) return;
    setClearing(true);
    try {
      await api.clearMyAuditLogs();
      setLogs([]);
      setSnack({ open: true, message: "Activity history cleared.", severity: "success" });
    } catch (error) {
      setSnack({ open: true, message: "Failed to clear activity history.", severity: "error" });
    } finally {
      setClearing(false);
    }
  };

  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        boxShadow: 6,
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      aria-label="My Activity History card"
    >
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={800} color="primary.main" component="h2">
            My Activity History
          </Typography>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClear}
            disabled={logs.length === 0 || clearing}
            aria-label="Clear activity history"
            sx={{ fontWeight: 600, fontSize: 13, textTransform: "none" }}
          >
            {clearing ? <CircularProgress size={18} /> : "Clear Activity"}
          </Button>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={6} aria-busy="true" aria-live="polite">
            <CircularProgress color="primary" />
          </Box>
        ) : logs.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 5, textAlign: "center" }}>
            No activity yet.
          </Typography>
        ) : (
          <List
            dense
            sx={{ flex: 1, overflowY: "auto", pr: 1, maxHeight: "60vh" }}
            aria-label="List of user activity logs"
          >
            {logs.map((log) => (
              <React.Fragment key={log.id || log.timestamp || Math.random()}>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette[actionIcon(log.action)?.props.color || "grey"]?.main || theme.palette.grey[500],
                        color: "#fff",
                      }}
                      aria-label={`${log.action || "Unknown"} action icon`}
                    >
                      {actionIcon(log.action)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography fontWeight={700} sx={{ textTransform: "capitalize" }}>
                        {log.action || "Unknown"}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" component="span" sx={{ wordBreak: "break-word" }}>
                          {log.target || "N/A"}
                          {log.details ? ` — ${log.details}` : ""}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                          {parseTimestamp(log.timestamp)}
                        </Typography>
                      </>
                    }
                    sx={{ ml: 1 }}
                  />
                </ListItem>
                {logs.indexOf(log) < logs.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((prev) => ({ ...prev, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
