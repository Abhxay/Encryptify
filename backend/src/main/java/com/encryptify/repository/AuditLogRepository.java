package com.encryptify.repository;

import com.encryptify.model.AuditLog;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUsername(String username);

    @Transactional
    @Modifying
    @Query("DELETE FROM AuditLog a WHERE a.username = :username")
    void deleteByUsername(@Param("username") String username);
}
