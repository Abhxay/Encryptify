package com.encryptify.repository;

import com.encryptify.model.FileEntry;
import com.encryptify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileEntry, Long> {

    // Used in FileListController and FileController
    List<FileEntry> findByUploadedBy_Username(String username);

    // Kept for backward compatibility (same query, different name style)
    default List<FileEntry> findByUploadedByUsername(String username) {
        return findByUploadedBy_Username(username);
    }

    // Used in FileListController for shared files
    List<FileEntry> findBySharedWithContaining(User user);

    // Used in FileController download
    List<FileEntry> findByFilename(String filename);
}