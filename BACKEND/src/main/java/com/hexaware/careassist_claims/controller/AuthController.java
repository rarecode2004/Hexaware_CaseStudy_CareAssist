package com.hexaware.careassist_claims.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.careassist_claims.dto.LoginRequestDTO;
import com.hexaware.careassist_claims.dto.LoginResponseDTO;
import com.hexaware.careassist_claims.dto.UserDTO;
import com.hexaware.careassist_claims.entity.Role;
import com.hexaware.careassist_claims.entity.User;
import com.hexaware.careassist_claims.exception.UserAlreadyExistsException;
import com.hexaware.careassist_claims.repository.RoleRepository;
import com.hexaware.careassist_claims.repository.UserRepository;
import com.hexaware.careassist_claims.security.JwtUtil;
import com.hexaware.careassist_claims.security.TokenBlacklistService;
import com.hexaware.careassist_claims.service.notification.EmailService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private TokenBlacklistService blacklistService;
    
    @Autowired
    private EmailService emailService;

    

    // ==================== LOGIN ====================
    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody @Valid LoginRequestDTO request) {

        logger.info("Login attempt: {}", request.getUsername());

        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid username or password");
        }

        User user = userRepo.findByUsername(request.getUsername());

        String roleName = user.getRole().getRoleName();

        String token = jwtUtil.generateToken(user.getUsername(), roleName);

        emailService.sendLoginEmail(user.getEmail());

        // ✅ RETURN userId ALSO
        return new LoginResponseDTO(token, roleName, user.getUserId());
    }

    // ==================== REGISTER ====================
    @PostMapping("/register")
    public String register(@RequestBody @Valid UserDTO dto) {

        // Check if username or email already exists
        if (userRepo.findByUsername(dto.getUsername()) != null) {
            logger.warn("Registration failed: username {} already exists", dto.getUsername());
            throw new UserAlreadyExistsException("Username already exists!");
        }
        if (userRepo.findByEmail(dto.getEmail()).isPresent()) {
            logger.warn("Registration failed: email {} already exists", dto.getEmail());
            throw new UserAlreadyExistsException("Email already exists!");
        }

        // Map DTO to entity
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        // Set role from roleId
        Role role = roleRepo.findById(dto.getRoleId())
                .orElseThrow(() -> {
                    logger.error("Registration failed: role id {} not found", dto.getRoleId());
                    return new RuntimeException("Role not found with id: " + dto.getRoleId());
                });
        user.setRole(role);

        userRepo.save(user);

        logger.info("User registered successfully: {}", dto.getUsername());
        return "User registered successfully";
    }
    
    //======================LOGOUT================================
    
    
    @PostMapping("/logout")
    public String logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            blacklistService.blacklist(token);
            logger.info("Token blacklisted: {}", token);
            return "Logged out successfully";
        }
        return "No token provided";
    }

}