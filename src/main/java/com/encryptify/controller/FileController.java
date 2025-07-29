package com.encryptify.controller;

import com.encryptify.model.FileEntry;
import com.encryptify.model.User;
import com.encryptify.model.AuditLog;
import com.encryptify.repository.FileRepository;
import com.encryptify.repository.UserRepository;
import com.encryptify.repository.AuditLogRepository;
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
import java.util.List;

@RestController
@RequestMapping("/api/file")
public class FileController {

    @Autowired
    private FileRepository fileEntryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFiles(@RequestParam("files") MultipartFile[] files,
                                              Authentication authentication) throws IOException {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        for (MultipartFile file : files) {
            byte[] encryptedData = EncryptionUtil.encrypt(file.getBytes());

            FileEntry fileEntry = new FileEntry();
            fileEntry.setFilename(file.getOriginalFilename());
            fileEntry.setData(encryptedData);
            fileEntry.setUploadedBy(user);
            fileEntry.setMimeType(file.getContentType());
            fileEntry.setSizeBytes(file.getSize());

            fileEntryRepository.save(fileEntry);

            auditService.log("UPLOAD", username, fileEntry.getFilename(), "File uploaded");
        }
        return ResponseEntity.ok("Files uploaded and encrypted successfully.");
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        FileEntry fileEntry = fileEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with ID: " + id));

        if (!fileEntry.getUploadedBy().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this file.");
        }

        fileEntryRepository.delete(fileEntry);

        auditService.log("DELETE", username, fileEntry.getFilename(), "File deleted");

        return ResponseEntity.ok("File deleted successfully.");
    }

    @GetMapping("/download/{filename}")
    public void downloadFile(@PathVariable String filename,
                             Authentication authentication,
                             HttpServletResponse response) throws IOException {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FileEntry> files = fileEntryRepository.findByFilename(filename);

        FileEntry fileEntry = files.stream()
                .filter(file -> file.getUploadedBy().getUsername().equals(username) || file.getSharedWith().contains(user))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("File not found or you do not have access."));

        byte[] decryptedData = EncryptionUtil.decrypt(fileEntry.getData());

        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileEntry.getFilename() + "\"");

        try (OutputStream os = response.getOutputStream()) {
            os.write(decryptedData);
            os.flush();
        }

        auditService.log("DOWNLOAD", username, fileEntry.getFilename(), "File downloaded");
    }

    // Endpoint: Get current user's audit logs
    @GetMapping("/audit/mine")
    public List<AuditLog> myAuditLogs(Authentication auth) {
        return auditLogRepository.findByUsername(auth.getName());
    }

    @DeleteMapping("/audit/clear")
    public ResponseEntity<String> clearMyAuditLogs(Authentication auth) {
        String username = auth.getName();
        auditLogRepository.deleteByUsername(username);
        return ResponseEntity.ok("Your audit logs have been cleared.");
    }

}
