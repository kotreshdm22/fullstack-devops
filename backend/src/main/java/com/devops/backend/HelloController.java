package com.devops.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/api/hello")
    public String hello() {
        return "API Working....";
    }

     @GetMapping("/api/hello-test")
    public String helloTest() {
        return "Hello from Spring Boot!test";
    }
}