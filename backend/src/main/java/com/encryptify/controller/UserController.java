package com.encryptify.controller;

import com.encryptify.model.FileEntry;
import com.encryptify.model.User;
import com.encryptify.repository.FileRepository;
import com.encryptify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired private UserRepository userRepository;
    @Autowired private FileRepository fileRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private static final long LIMIT_BYTES = 100L * 1024 * 1024; // 100 MB

    // ── Storage info ──────────────────────────────────────────────────────────
    @GetMapping("/storage")
    public ResponseEntity<?> getStorageInfo(Authentication authentication) {
        String username = authentication.getName();

        // findByUploadedBy_Username uses Spring Data underscore traversal for nested property
        List<FileEntry> files = fileRepository.findByUploadedBy_Username(username);

        long usedBytes = files.stream()
                .mapToLong(f -> f.getSizeBytes() != null ? f.getSizeBytes() : 0L)
                .sum();

        int fileCount   = files.size();
        double usedMB   = Math.round((usedBytes / (1024.0 * 1024.0)) * 10.0) / 10.0;
        double limitMB  = Math.round((LIMIT_BYTES / (1024.0 * 1024.0)) * 10.0) / 10.0;
        double pct      = Math.round((usedBytes * 100.0 / LIMIT_BYTES) * 10.0) / 10.0;
        double percentUsed = Math.min(100.0, pct);

        return ResponseEntity.ok(new StorageInfo(usedBytes, usedMB, fileCount, limitMB, percentUsed));
    }

    // ── Change username ───────────────────────────────────────────────────────
    @PatchMapping("/username")
    public ResponseEntity<?> changeUsername(
            @RequestBody ChangeUsernameRequest req,
            Authentication authentication) {

        String currentUsername = authentication.getName();
        if (req.getNewUsername() == null || req.getNewUsername().isBlank())
            return ResponseEntity.badRequest().body(new ApiResponse(false, "New username cannot be empty."));
        if (req.getNewUsername().trim().equals(currentUsername))
            return ResponseEntity.badRequest().body(new ApiResponse(false, "New username is the same as current."));
        if (userRepository.existsByUsername(req.getNewUsername().trim()))
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(false, "Username already taken. Choose another."));

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(req.getNewUsername().trim());
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse(true, "Username updated successfully."));
    }

    // ── Change password ───────────────────────────────────────────────────────
    @PatchMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest req,
            Authentication authentication) {

        String currentUsername = authentication.getName();
        if (req.getCurrentPassword() == null || req.getNewPassword() == null)
            return ResponseEntity.badRequest().body(new ApiResponse(false, "All password fields are required."));
        if (req.getNewPassword().length() < 6)
            return ResponseEntity.badRequest().body(new ApiResponse(false, "New password must be at least 6 characters."));

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Current password is incorrect."));

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse(true, "Password updated successfully."));
    }

    // ── DTOs ──────────────────────────────────────────────────────────────────
    public static class StorageInfo {
        public long   usedBytes;
        public double usedMB;
        public int    fileCount;
        public double limitMB;
        public double percentUsed;
        public StorageInfo(long ub, double um, int fc, double lm, double pu) {
            usedBytes = ub; usedMB = um; fileCount = fc; limitMB = lm; percentUsed = pu;
        }
    }

    public static class ChangeUsernameRequest {
        private String newUsername;
        public String getNewUsername() { return newUsername; }
        public void setNewUsername(String v) { this.newUsername = v; }
    }

    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String v) { this.currentPassword = v; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String v) { this.newPassword = v; }
    }

    public static class ApiResponse {
        private boolean success;
        private String  message;
        public ApiResponse(boolean success, String message) {
            this.success = success; this.message = message;
        }
        public boolean isSuccess() { return success; }
        public String  getMessage() { return message; }
    }
}