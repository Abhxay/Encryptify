import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import FlareIcon from "@mui/icons-material/Flare";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";
import AuditLogList from "../components/AuditLogList";
import api from "../services/api";

export default function Dashboard() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [encryptedCount, setEncryptedCount] = useState(0);
  const [sharedCount, setSharedCount] = useState(0);

  const username = localStorage.getItem("username") || "Unknown User";

  // Toggle refreshFlag to indicate data should be reloaded
  const triggerRefresh = () => setRefreshFlag((flag) => !flag);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const response = await api.get("/api/file/list");
        const files = response.data;
        setEncryptedCount(files.length);
        setSharedCount(files.filter((f) => f.sharedByYou).length);
      } catch {
        setEncryptedCount(0);
        setSharedCount(0);
      }
    }
    fetchCounts();
  }, [refreshFlag]);

  return (
    <Box
      sx={{
        maxWidth: 1300,
        mx: "auto",
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 4 },
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Header Section */}
      <Paper
        elevation={12}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 5,
          borderRadius: 3,
          position: "relative",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1f1f2f 30%, #121212 100%)"
              : "linear-gradient(135deg, #e0f7fa 30%, #ffffff 100%)",
        }}
      >
        {/* Username Badge */}
        <Chip
          icon={<AccountCircleIcon />}
          label={username}
          size="medium"
          color="#2DED21"
          sx={{
            position: "absolute",
            top: 16,
            right: 24,
            fontWeight: 700,
            bgcolor: "background.paper",
            border: "1.5px solid",
            borderColor: "primary.main",
            px: 2,
            py: "6px",
            boxShadow: 1,
          }}
          aria-label="Logged-in username badge"
        />
        <Stack direction="row" alignItems="center" spacing={3}>
          {/* Dashboard logo */}
          <Box
            component="img"
            src={process.env.PUBLIC_URL + "/weblogo.png"}
            alt="Dashboard Logo"
            sx={{
              height: 70,
              width: 70,
              mr: 2.5,
              borderRadius: 3,
              boxShadow: 6,
              bgcolor: "#fff",
              p: 1,
            }}
          />
          <Box>
            <Typography
              variant="h3"
              fontWeight={900}
              color="primary.main"
              gutterBottom
              sx={{ letterSpacing: "-0.04em", lineHeight: 1 }}
            >
              Welcome to Encryptify
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
              Securely upload, share, and manage your encrypted files
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 4 }}
          sx={{ mt: 4, maxWidth: { sm: 420 } }}
        >
          <StatsCard
            title="Encrypted Files"
            count={encryptedCount}
            icon={<CloudDoneIcon fontSize="large" color="success" />}
          />
          <StatsCard
            title="Files Shared"
            count={sharedCount}
            icon={<FlareIcon fontSize="large" color="warning" />}
          />
        </Stack>
      </Paper>

      {/* Main Panels */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "stretch",
          minHeight: { md: "70vh", xs: "auto" },
          mb: 6,
        }}
      >
        {/* Files Panel */}
        <Paper
          elevation={8}
          sx={{
            flex: "0 0 530px",
            display: "flex",
            flexDirection: "column",
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 4,
            minWidth: 380,
            height: { md: "100%", xs: "auto" },
          }}
        >
          <Typography
            variant="overline"
            color="primary"
            sx={{ letterSpacing: "0.2em", mb: 1, fontWeight: 700 }}>
            
            
          </Typography>
          <FileUpload refresh={triggerRefresh} />
          <Box sx={{ mt: 3, flex: 1, overflowY: "auto" }}>
            <FileList refreshFlag={refreshFlag} triggerRefresh={triggerRefresh} />
          </Box>
        </Paper>

        {/* Activity Panel */}
        <Paper
          elevation={8}
          sx={{
            width: 400,
            flex: 1,
            minWidth: 350,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 4,
            p: 3,
            display: "flex",
            flexDirection: "column",
            height: { md: "100%", xs: "auto" },
          }}
        >
          <Typography
            variant="overline"
            color="primary"
            sx={{ letterSpacing: "0.2em", mb: 1, fontWeight: 700 }}
          >
          
          </Typography>
          <AuditLogList refreshFlag={refreshFlag} />
        </Paper>
      </Box>
    </Box>
  );
}

function StatsCard({ title, count, icon }) {
  return (
    <Paper
      elevation={5}
      sx={{
        p: 3,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.08)"
            : "rgba(25, 118, 210, 0.1)",
        borderRadius: 3,
        boxShadow: 4,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.2,
      }}
    >
      {icon}
      <Typography variant="h4" component="span" color="primary.main" sx={{ mt: 1 }}>
        {count}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: "0.1em", mt: 0.5, fontWeight: 600 }}>
        {title}
      </Typography>
    </Paper>
  );
}
