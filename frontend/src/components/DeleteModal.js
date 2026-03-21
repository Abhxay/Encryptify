import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import api from "../services/api";

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function DeleteModal({ file, darkMode, onClose, onDeleted }) {
  const [window, setWindow]     = useState(null); // { canDeleteForEveryone, secondsRemaining }
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading]   = useState(true);
  const [acting, setActing]     = useState(false);
  const [confirm, setConfirm]   = useState(null); // "self" | "everyone"

  const isOwner = !file.sharedBy;

  const bg      = darkMode ? "#0f0f1a"                : "#ffffff";
  const border  = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const overlay = darkMode ? "rgba(0,0,0,0.65)"       : "rgba(0,0,0,0.35)";
  const textPri = darkMode ? "#f1f0ff"                : "#0d0b1e";
  const textSec = darkMode ? "rgba(241,240,255,0.45)" : "rgba(13,11,30,0.5)";

  // Fetch window info for owner files
  useEffect(() => {
    if (!isOwner) { setLoading(false); return; }
    api.get(`/file/delete-window/${file.id}`)
      .then(res => {
        setWindow(res.data);
        setTimeLeft(res.data.secondsRemaining);
      })
      .catch(() => setWindow({ canDeleteForEveryone: false, secondsRemaining: 0 }))
      .finally(() => setLoading(false));
  }, [file.id, isOwner]);

  // Countdown tick
  useEffect(() => {
    if (!window?.canDeleteForEveryone) return;
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => {
      if (t <= 1) { clearInterval(id); setWindow(w => ({ ...w, canDeleteForEveryone: false })); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [window?.canDeleteForEveryone, timeLeft]);

  const handleDelete = async (mode) => {
    setActing(true);
    try {
      await api.delete(`/file/delete/${file.id}?mode=${mode}`);
      onDeleted(mode);
      onClose();
    } catch (err) {
      const msg = err.response?.data || "Delete failed.";
      alert(msg);
    } finally {
      setActing(false);
      setConfirm(null);
    }
  };

  const btnBase = {
    width: "100%", py: "11px", borderRadius: "9px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    px: 2, mb: 1.5, border: "0.5px solid", transition: "all 0.15s",
  };

  return (
    <>
      {/* Backdrop */}
      <Box onClick={onClose} sx={{
        position: "fixed", inset: 0, zIndex: 200,
        background: overlay, backdropFilter: "blur(4px)",
      }} />

      {/* Modal */}
      <Box sx={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 201, width: { xs: "calc(100vw - 40px)", sm: 400 },
        background: bg, border: `0.5px solid ${border}`,
        borderRadius: "16px",
        boxShadow: darkMode ? "0 32px 80px rgba(0,0,0,0.6)" : "0 16px 48px rgba(0,0,0,0.15)",
        overflow: "hidden",
      }}>

        {/* Header */}
        <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: `0.5px solid ${border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: textPri,
              fontFamily: "'Syne',sans-serif" }}>
              Delete file
            </Typography>
            <Typography sx={{ fontSize: 12, color: textSec, mt: 0.3,
              maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {file.filename}
            </Typography>
          </Box>
          <Box onClick={onClose} sx={{
            width: 28, height: 28, borderRadius: "7px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: textSec,
            "&:hover": { background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" },
          }}>×</Box>
        </Box>

        <Box sx={{ px: 3, pt: 2.5, pb: 3 }}>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={20} sx={{ color: "#7c3aed" }} />
            </Box>
          ) : (
            <>
              {/* Confirm step */}
              {confirm ? (
                <Box>
                  <Typography sx={{ fontSize: 13, color: textSec, mb: 2.5, lineHeight: 1.7 }}>
                    {confirm === "everyone"
                      ? "This will permanently delete the file for you and all recipients. This cannot be undone."
                      : "This will remove the file from your vault only."}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Box onClick={() => setConfirm(null)} sx={{
                      flex: 1, py: "10px", borderRadius: "8px", cursor: "pointer",
                      textAlign: "center", fontSize: 13,
                      border: `0.5px solid ${border}`, color: textSec,
                      "&:hover": { background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" },
                    }}>
                      Cancel
                    </Box>
                    <Box onClick={() => handleDelete(confirm)} sx={{
                      flex: 1, py: "10px", borderRadius: "8px", cursor: acting ? "not-allowed" : "pointer",
                      textAlign: "center", fontSize: 13, fontWeight: 500,
                      background: confirm === "everyone"
                        ? "linear-gradient(135deg,#ef4444,#dc2626)"
                        : "linear-gradient(135deg,#7c3aed,#0ea5e9)",
                      color: "#fff",
                      opacity: acting ? 0.7 : 1,
                    }}>
                      {acting ? "Deleting..." : "Confirm"}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <>
                  {/* Option 1: Delete for me */}
                  <Box onClick={() => setConfirm("self")} sx={{
                    ...btnBase,
                    borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                    background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                    "&:hover": {
                      borderColor: "#7c3aed",
                      background: "rgba(124,58,237,0.06)",
                    },
                  }}>
                    <Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 500, color: textPri }}>
                        {isOwner ? "Delete for me only" : "Remove from my vault"}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: textSec, mt: 0.3 }}>
                        {isOwner
                          ? "File stays in recipients' vaults"
                          : "Removes this shared file from your view"}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 18, color: "#7c3aed" }}>→</Typography>
                  </Box>

                  {/* Option 2: Delete for everyone — owner only */}
                  {isOwner && (
                    <Box>
                      <Box
                        onClick={() => window?.canDeleteForEveryone && setConfirm("everyone")}
                        sx={{
                          ...btnBase, mb: 1,
                          borderColor: window?.canDeleteForEveryone
                            ? "rgba(239,68,68,0.3)"
                            : darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                          background: window?.canDeleteForEveryone
                            ? "rgba(239,68,68,0.05)"
                            : darkMode ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
                          cursor: window?.canDeleteForEveryone ? "pointer" : "not-allowed",
                          opacity: window?.canDeleteForEveryone ? 1 : 0.5,
                          "&:hover": window?.canDeleteForEveryone ? {
                            borderColor: "#ef4444",
                            background: "rgba(239,68,68,0.08)",
                          } : {},
                        }}
                      >
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 500, color: textPri }}>
                            Delete for everyone
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: textSec, mt: 0.3 }}>
                            Removes file for you and all recipients
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          {window?.canDeleteForEveryone ? (
                            <Typography sx={{
                              fontSize: 11, fontWeight: 600,
                              color: timeLeft < 120 ? "#f87171" : "#34d399",
                              fontFamily: "'DM Mono',monospace",
                            }}>
                              {formatTime(timeLeft)}
                            </Typography>
                          ) : (
                            <Typography sx={{ fontSize: 10, color: textSec }}>
                              expired
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Warning */}
                      <Box sx={{
                        px: 1.5, py: 1, borderRadius: "7px",
                        background: window?.canDeleteForEveryone
                          ? "rgba(239,68,68,0.06)"
                          : "rgba(0,0,0,0.0)",
                        border: window?.canDeleteForEveryone
                          ? "0.5px solid rgba(239,68,68,0.15)"
                          : "0.5px solid transparent",
                      }}>
                        <Typography sx={{ fontSize: 11, color: textSec, lineHeight: 1.6 }}>
                          {window?.canDeleteForEveryone
                            ? "⚠ Delete for everyone is only available within 10 minutes of upload."
                            : "The 10-minute window has expired. You can only delete for yourself now."}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
}