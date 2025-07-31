import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Avatar,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Grid,
  Box,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import { useTheme } from "@mui/material/styles";
import api from "../services/api";

export default function FileList({ refreshFlag, triggerRefresh }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [files, setFiles] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const showMessage = (msg, severity = "success") => {
    setSnack({ open: true, message: msg, severity });
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await api.get("/file/list");
        if (Array.isArray(res.data)) {
          setFiles(res.data);
        } else {
          console.error("File list response is not an array", res.data);
          setFiles([]);
          showMessage("Unexpected data format received.", "warning");
        }
      } catch (err) {
        console.error("Error fetching file list:", err);
        showMessage("Could not fetch files.", "error");
        setFiles([]);
      }
    };
    fetchFiles();
  }, [refreshFlag]);

  const handleDownload = async (filename) => {
    try {
      const res = await api.get(`/file/download/${filename}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showMessage("Downloaded!", "success");
    } catch (err) {
      console.error("Error downloading file:", err);
      showMessage("Download failed.", "error");
    }
  };

  const handleDelete = async (id, shared) => {
    try {
      if (shared) await api.delete(`/file/unshare/${id}`);
      else await api.delete(`/file/delete/${id}`);
      showMessage("Deleted!", "success");
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error("Error deleting file:", err);
      showMessage("Delete failed.", "error");
    }
  };

  const handleShare = async (id) => {
    const username = prompt("Enter username to share with");
    if (!username) return;
    try {
      await api.post(`/file/share/${id}?username=${username}`);
      showMessage(`File shared with ${username}!`, "info");
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error("Error sharing file:", err);
      showMessage("Sharing failed.", "error");
    }
  };

  return (
    <Card
      sx={{
        p: 1,
        bgcolor: "background.paper",
        boxShadow: 6,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: isDarkMode ? "#fff" : "#111" }}>
          Your Files
        </Typography>
      </CardContent>

      <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
        <Grid container spacing={2}>
          {files.length === 0 ? (
            <Typography sx={{ pl: 2, py: 4, color: isDarkMode ? "#ccc" : "#444" }}>
              No files uploaded or shared yet.
            </Typography>
          ) : (
            files.map((file) => (
              <Grid item xs={12} key={file.id}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                  sx={{
                    p: 1.5,
                    background: isDarkMode ? "#e6f1f6" : "#e7f5fa",
                    borderRadius: 3,
                    boxShadow: 1,
                    transition: "background 0.2s",
                    overflow: "hidden", // prevent overflow at container level
                    "&:hover": { background: isDarkMode ? "#d6e6f2" : "#f1f3fc" },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    flex={1}
                    minWidth={0} // allow children to shrink within flex container
                    sx={{ overflow: "hidden" }}
                  >
                    <Avatar variant="rounded" sx={{ bgcolor: "#183eb0", width: 42, height: 42 }}>
                      <InsertDriveFileIcon sx={{ color: "#fff", fontSize: 28 }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Tooltip title={file.filename} placement="top-start" arrow>
                        <Typography
                          fontWeight={700}
                          sx={{
                            color: isDarkMode ? "#000" : "#222",
                            maxWidth: 180, // adjust width as needed
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {file.filename}
                        </Typography>
                      </Tooltip>
                      <Typography variant="caption" sx={{ color: isDarkMode ? "#333" : "#666" }}>
                        {new Date(file.uploadTimestamp).toLocaleString()} &nbsp;|&nbsp; {file.mimeType} &nbsp;|&nbsp;{" "}
                        {(file.sizeBytes / 1024).toFixed(1)} KB
                      </Typography>
                      {file.sharedByYou && (
                        <Chip label="Shared by me" color="secondary" size="small" sx={{ ml: 1, fontWeight: 700 }} />
                      )}
                      {file.sharedBy && (
                        <Chip
                          label={`Shared by ${file.sharedBy}`}
                          color="info"
                          size="small"
                          sx={{ ml: 1, fontWeight: 700 }}
                        />
                      )}
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={0.5} flexShrink={0}>
                    <Tooltip title="Download">
                      <IconButton color="primary" size="large" onClick={() => handleDownload(file.filename)}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" size="large" onClick={() => handleDelete(file.id, !!file.sharedBy)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton color="secondary" size="large" onClick={() => handleShare(file.id)}>
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
