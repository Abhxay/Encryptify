package com.encryptify.repository;

import com.encryptify.model.FileEntry;
import com.encryptify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<FileEntry, Long> {

    Optional<FileEntry> findByFilenameAndUploadedByUsername(String filename, String username);
    List<FileEntry> findByFilename(String filename);
    List<FileEntry> findByUploadedByUsername(String username);
    List<FileEntry> findBySharedWithContaining(User user);
}
