package com.encryptify.controller;

import com.encryptify.model.FileEntry;
import com.encryptify.model.User;
import com.encryptify.repository.FileRepository;
import com.encryptify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/file")
public class FileListController {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserRepository userRepository;

    record FileListDTO(
            Long id,
            String filename,
            int sizeBytes,
            String uploadedBy,
            boolean sharedByYou,   // true if uploaded by current user and shared out
            String sharedBy        // populated if uploaded by someone else and shared with current user
    ) {}

    @GetMapping("/list")
    public ResponseEntity<?> listUserFiles(Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Files uploaded by current user (admin)
        List<FileEntry> uploaded = fileRepository.findByUploadedByUsername(username);

        // Files shared with current user (uploaded by others)
        List<FileEntry> sharedWithMe = fileRepository.findBySharedWithContaining(currentUser);

        // Combine lists avoiding duplicates using file id key
        Map<Long, FileEntry> uniqueFiles = new HashMap<>();
        uploaded.forEach(file -> uniqueFiles.put(file.getId(), file));
        sharedWithMe.forEach(file -> uniqueFiles.putIfAbsent(file.getId(), file));

        // Map files to DTO with badges info
        List<FileListDTO> fileList = uniqueFiles.values().stream()
                .map(file -> {
                    boolean isMine = file.getUploadedBy().getUsername().equals(username);
                    boolean sharedByYou = isMine && !file.getSharedWith().isEmpty();
                    String sharedBy = !isMine ? file.getUploadedBy().getUsername() : null;

                    return new FileListDTO(
                            file.getId(),
                            file.getFilename(),
                            file.getData().length,
                            file.getUploadedBy().getUsername(),
                            sharedByYou,
                            sharedBy
                    );
                })

                .collect(Collectors.toList());

        return ResponseEntity.ok(fileList);
    }
}
