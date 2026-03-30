package com.AIML3A.JWTAuth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.AIML3A.JWTAuth.service.AuthService;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("/login")
    public String login(@RequestParam String username,
                        @RequestParam String password) {

        System.out.println("Login API Hit");
        return service.login(username, password);
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello! JWT Authentication Successful";
    }
}