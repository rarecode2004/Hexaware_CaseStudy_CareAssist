package com.hexaware.careassist_claims.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.careassist_claims.dto.RoleDTO;
import com.hexaware.careassist_claims.entity.Role;
import com.hexaware.careassist_claims.repository.RoleRepository;

@Service
@Transactional
public class RoleServiceImpl implements IRoleService {

    @Autowired
    private RoleRepository repo;

    // ================== ADD ROLE ==================
    @Override
    public int addRole(RoleDTO dto) {

        Role role = mapToEntity(dto);

        repo.save(role);
        return 1;
    }

    // ================== GET ALL ROLES ==================
    @Override
    public List<RoleDTO> getAllRoles() {

        return repo.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== GET ROLE BY ID ==================
    @Override
    public RoleDTO getRoleById(int roleId) {

        Role role = repo.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        return mapToDTO(role);
    }

    // ================== DELETE ROLE ==================
    @Override
    public int deleteRole(int roleId) {

        if (!repo.existsById(roleId)) {
            throw new RuntimeException("Role not found");
        }

        repo.deleteById(roleId);
        return 1;
    }

    // ================== MAPPING METHODS ==================

    // 🔁 Entity → DTO
    private RoleDTO mapToDTO(Role role) {

        RoleDTO dto = new RoleDTO();

        dto.setRoleId(role.getRoleId());
        dto.setRoleName(role.getRoleName());

        return dto;
    }

    // 🔁 DTO → Entity
    private Role mapToEntity(RoleDTO dto) {

        Role role = new Role();

        role.setRoleName(dto.getRoleName());

        return role;
    }
}