package com.encryptify.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/protected")
public class TestController {

    @GetMapping("/test")
    public String testJwt() {
        return "✅ JWT is working! You are authenticated.";
    }
}

