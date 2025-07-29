package com.encryptify.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    @Lob
    @Column(name = "data", columnDefinition = "LONGBLOB")
    private byte[] data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id")
    private User uploadedBy;

    @ManyToMany
    @JoinTable(
            name = "file_shared_with",
            joinColumns = @JoinColumn(name = "file_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> sharedWith = new HashSet<>();

    @CreationTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Instant uploadTimestamp;

    @UpdateTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Instant lastModified;

    private String mimeType;   // NEW: MIME type
    private Long sizeBytes;

    @Transient
    public boolean isShared() {
        return !sharedWith.isEmpty();
    }
}
