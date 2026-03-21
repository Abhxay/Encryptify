package com.encryptify.controller;

import com.encryptify.model.FileEntry;
import com.encryptify.model.User;
import com.encryptify.repository.FileRepository;
import com.encryptify.repository.UserRepository;
import com.encryptify.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/file")
public class FileShareController {

    @Autowired private FileRepository fileRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AuditService auditService;

    @PostMapping("/share/{fileId}")
    public ResponseEntity<String> shareFileWithUser(
            @PathVariable Long fileId,
            @RequestParam String username,
            Authentication authentication) {

        String uploaderUsername = authentication.getName();
        User uploader = userRepository.findByUsername(uploaderUsername)
                .orElseThrow(() -> new RuntimeException("Uploader not found"));
        FileEntry file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        if (!file.getUploadedBy().getId().equals(uploader.getId()))
            return ResponseEntity.status(403).body("You are not authorized to share this file.");
        if (uploader.getUsername().equals(username))
            return ResponseEntity.badRequest().body("Cannot share file with yourself.");

        User targetUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        if (file.getSharedWith().contains(targetUser))
            return ResponseEntity.ok("File was already shared with " + username);

        file.getSharedWith().add(targetUser);
        fileRepository.save(file);

        // Log for sender
        auditService.log("SHARE", uploaderUsername, file.getFilename(),
                "Shared with " + username);

        // ── NEW: Log for recipient so they see it in their activity ──
        auditService.log("RECEIVED", username, file.getFilename(),
                "Shared by " + uploaderUsername);

        return ResponseEntity.ok("File shared successfully with " + username);
    }

    @DeleteMapping("/unshare/{fileId}")
    public ResponseEntity<?> unshareFile(@PathVariable Long fileId, Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        FileEntry file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        if (file.getUploadedBy().getUsername().equals(username))
            return ResponseEntity.status(403).body("Owner should use Delete, not Unshare.");
        if (!file.getSharedWith().contains(currentUser))
            return ResponseEntity.badRequest().body("File was not shared with this user.");

        file.getSharedWith().remove(currentUser);
        fileRepository.save(file);

        auditService.log("UNSHARE", username, file.getFilename(), "Removed from my vault");
        return ResponseEntity.ok("File unshared.");
    }
}