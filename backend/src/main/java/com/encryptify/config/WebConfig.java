package com.encryptify.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3000",
                        "https://localhost:3000",
                        "http://127.0.0.1:3000",
                        // Add Codespaces URLs as needed
                        "https://turbo-bassoon-v666pxqxjj62wwg4-3000.app.github.dev",
                        "https://turbo-bassoon-v666pxqxjj62wwg4-8089.app.github.dev"
                )
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
