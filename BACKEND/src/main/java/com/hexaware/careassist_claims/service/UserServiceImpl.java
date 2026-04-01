package com.hexaware.careassist_claims.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.careassist_claims.dto.UserDTO;
import com.hexaware.careassist_claims.entity.Role;
import com.hexaware.careassist_claims.entity.User;
import com.hexaware.careassist_claims.repository.RoleRepository;
import com.hexaware.careassist_claims.repository.UserRepository;

@Service
@Transactional
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ================== ADD USER ==================
    @Override
    public int addUser(UserDTO dto) {

        User user = mapToEntity(dto);

        userRepo.save(user);
        return 1;
    }

    // ================== GET ALL USERS ==================
    @Override
    public List<UserDTO> getAllUsers() {

        return userRepo.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== GET USER BY ID ==================
    @Override
    public UserDTO getUserById(int userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToDTO(user);
    }

    // ================== GET USER BY EMAIL ==================
    @Override
    public UserDTO getUserByEmail(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return mapToDTO(user);
    }

    // ================== UPDATE USER ==================
    @Override
    public int updateUser(UserDTO dto) {

        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        Role role = roleRepo.findById(dto.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setRole(role);

        userRepo.save(user);
        return 1;
    }

    // ================== DELETE USER ==================
    @Override
    public int deleteUser(int userId) {

        userRepo.deleteById(userId);
        return 1;
    }

    // ================== UPDATE OWN PROFILE ==================
    @Override
    public int updateOwnProfile(UserDTO dto) {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepo.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        userRepo.save(user);
        return 1;
    }

    // ================== MAPPING METHODS ==================

    // 🔁 Entity → DTO
    private UserDTO mapToDTO(User user) {

        UserDTO dto = new UserDTO();

        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoleId(user.getRole().getRoleId());

        return dto;
    }

    // 🔁 DTO → Entity
    private User mapToEntity(UserDTO dto) {

        User user = new User();

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        Role role = roleRepo.findById(dto.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setRole(role);

        return user;
    }
}