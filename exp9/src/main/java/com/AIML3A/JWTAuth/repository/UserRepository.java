package com.AIML3A.JWTAuth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AIML3A.JWTAuth.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
}