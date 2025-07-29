package com.encryptify.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Data
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;   // e.g., UPLOAD, DOWNLOAD, SHARE, DELETE
    private String username;
    private String target;   // e.g., filename or file ID

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Instant timestamp = Instant.now();

    private String details;  // extra info (can be left null)
}
