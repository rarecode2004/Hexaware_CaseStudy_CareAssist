package com.hexaware.careassist_claims.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.careassist_claims.dto.UserDTO;
import com.hexaware.careassist_claims.service.IUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserRestController {

    @Autowired
    private IUserService service;

    // Add User
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public int addUser(@Valid @RequestBody UserDTO dto) {
        return service.addUser(dto);
    }

    // Get All Users
    @GetMapping("/getall")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDTO> getAllUsers() {
        return service.getAllUsers();
    }

    // Get User By ID
    @GetMapping("/get/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserDTO getUserById(@PathVariable int userId) {
        return service.getUserById(userId);
    }

    // Get User By Email
    @GetMapping("/get/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserDTO getUserByEmail(@PathVariable String email) {
        return service.getUserByEmail(email);
    }

    // Update User
    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public int updateUser(@Valid @RequestBody UserDTO dto) {
        return service.updateUser(dto);
    }

    // Delete User
    @DeleteMapping("/delete/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public int deleteUser(@PathVariable int userId) {
        return service.deleteUser(userId);
    }
    
    @PutMapping("/update-profile")
    @PreAuthorize("isAuthenticated()")
    public int updateOwnProfile(@Valid @RequestBody UserDTO dto) {
        return service.updateOwnProfile(dto);
    }
    
    
}