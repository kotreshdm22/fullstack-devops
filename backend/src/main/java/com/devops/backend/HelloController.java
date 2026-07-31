package com.devops.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
public class HelloController {

    @GetMapping("/api/hello")
    public Map<String, Object> hello() {
        String currentDateTime = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));

        return Map.of(
                "message", "API is working",
                "timestamp", currentDateTime
        );
    }

    @GetMapping("/api/hello-test")
    public Map<String, String> helloTest() {
        return Map.of(
                "message", "Hello from Spring Boot!"
        );
    }
}