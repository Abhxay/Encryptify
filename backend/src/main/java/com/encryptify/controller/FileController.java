package com.encryptify.controller;

import com.encryptify.model.AuditLog;
import com.encryptify.model.FileEntry;
import com.encryptify.model.User;
import com.encryptify.repository.AuditLogRepository;
import com.encryptify.repository.FileRepository;
import com.encryptify.repository.UserRepository;
import com.encryptify.service.AuditService;
import com.encryptify.utility.EncryptionUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStream;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/file")
public class FileController {

    @Autowired private FileRepository fileEntryRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AuditService auditService;
    @Autowired private AuditLogRepository auditLogRepository;

    // ── Upload ────────────────────────────────────────────────────────────────
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFiles(
            @RequestParam("files") MultipartFile[] files,
            Authentication authentication) throws IOException {

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        for (MultipartFile file : files) {
            byte[] encryptedData = EncryptionUtil.encrypt(file.getBytes());
            FileEntry entry = new FileEntry();
            entry.setFilename(file.getOriginalFilename());
            entry.setData(encryptedData);
            entry.setUploadedBy(user);
            entry.setMimeType(file.getContentType());
            entry.setSizeBytes(file.getSize());
            fileEntryRepository.save(entry);
            auditService.log("UPLOAD", username, entry.getFilename(), "File uploaded");
        }
        return ResponseEntity.ok("Files uploaded and encrypted successfully.");
    }

    // ── Delete — mode=self or mode=everyone ──────────────────────────────────
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFile(
            @PathVariable Long id,
            @RequestParam(defaultValue = "self") String mode,
            Authentication authentication) {

        String username = authentication.getName();
        FileEntry file = fileEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with ID: " + id));

        boolean isOwner = file.getUploadedBy().getUsername().equals(username);

        // ── Recipient "delete for me" = unshare ──────────────────────────────
        if (!isOwner) {
            User currentUser = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (!file.getSharedWith().contains(currentUser))
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You do not have access to this file.");
            file.getSharedWith().remove(currentUser);
            fileEntryRepository.save(file);
            auditService.log("UNSHARE", username, file.getFilename(), "Removed from my vault");
            return ResponseEntity.ok("File removed from your vault.");
        }

        // ── Owner delete for self only ────────────────────────────────────────
        if ("self".equals(mode)) {
            fileEntryRepository.delete(file);
            auditService.log("DELETE", username, file.getFilename(), "Deleted for myself only");
            return ResponseEntity.ok("File deleted from your vault.");
        }

        // ── Owner delete for everyone ─────────────────────────────────────────
        if ("everyone".equals(mode)) {
            // 10-minute window check
            Instant uploadTime = file.getUploadTimestamp();
            Instant cutoff = uploadTime.plus(10, ChronoUnit.MINUTES);
            if (Instant.now().isAfter(cutoff)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("The 10-minute window to delete for everyone has expired. You can only delete for yourself now.");
            }

            // Log FILE_REMOVED for every recipient BEFORE deleting
            Set<User> recipients = file.getSharedWith();
            for (User recipient : recipients) {
                auditService.log(
                        "FILE_REMOVED",
                        recipient.getUsername(),
                        file.getFilename(),
                        "Deleted for everyone by " + username
                );
            }

            // Delete file from DB (cascades sharedWith)
            fileEntryRepository.delete(file);
            auditService.log("DELETED_FOR_EVERYONE", username, file.getFilename(),
                    "Deleted for everyone (" + recipients.size() + " recipients removed)");

            return ResponseEntity.ok("File deleted for everyone.");
        }

        return ResponseEntity.badRequest().body("Invalid mode. Use 'self' or 'everyone'.");
    }

    // ── Download ──────────────────────────────────────────────────────────────
    @GetMapping("/download/{filename}")
    public void downloadFile(
            @PathVariable String filename,
            Authentication authentication,
            HttpServletResponse response) throws IOException {

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<FileEntry> files = fileEntryRepository.findByFilename(filename);
        FileEntry file = files.stream()
                .filter(f -> f.getUploadedBy().getUsername().equals(username)
                        || f.getSharedWith().contains(user))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("File not found or access denied."));

        byte[] decrypted = EncryptionUtil.decrypt(file.getData());
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + file.getFilename() + "\"");
        try (OutputStream os = response.getOutputStream()) {
            os.write(decrypted);
            os.flush();
        }
        auditService.log("DOWNLOAD", username, file.getFilename(), "File downloaded");
    }

    // ── Audit logs ────────────────────────────────────────────────────────────
    @GetMapping("/audit/mine")
    public List<AuditLog> myAuditLogs(Authentication auth) {
        return auditLogRepository.findByUsername(auth.getName());
    }

    @DeleteMapping("/audit/clear")
    public ResponseEntity<String> clearMyAuditLogs(Authentication auth) {
        auditLogRepository.deleteByUsername(auth.getName());
        return ResponseEntity.ok("Your audit logs have been cleared.");
    }

    // ── Window check endpoint (used by frontend to show countdown) ────────────
    @GetMapping("/delete-window/{id}")
    public ResponseEntity<?> checkDeleteWindow(
            @PathVariable Long id,
            Authentication authentication) {

        String username = authentication.getName();
        FileEntry file = fileEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        if (!file.getUploadedBy().getUsername().equals(username))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not the owner.");

        Instant uploadTime = file.getUploadTimestamp();
        Instant cutoff = uploadTime.plus(10, ChronoUnit.MINUTES);
        long secondsLeft = Instant.now().until(cutoff, ChronoUnit.SECONDS);

        return ResponseEntity.ok(new WindowResponse(
                secondsLeft > 0,
                Math.max(0, secondsLeft)
        ));
    }

    public static class WindowResponse {
        public boolean canDeleteForEveryone;
        public long secondsRemaining;
        public WindowResponse(boolean can, long secs) {
            this.canDeleteForEveryone = can;
            this.secondsRemaining = secs;
        }
    }
}