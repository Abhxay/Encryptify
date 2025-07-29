package com.encryptify.service;

import com.encryptify.model.AuditLog;
import com.encryptify.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    @Autowired
    private AuditLogRepository repo;

    public void log(String action, String username, String target, String details) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setUsername(username);
        log.setTarget(target);
        log.setDetails(details);
        repo.save(log);
    }
}
