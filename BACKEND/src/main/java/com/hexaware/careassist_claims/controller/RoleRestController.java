package com.hexaware.careassist_claims.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.careassist_claims.dto.RoleDTO;
import com.hexaware.careassist_claims.service.IRoleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/roles")
public class RoleRestController {

    @Autowired
    private IRoleService service;

    // Add Role
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public int addRole(@Valid @RequestBody RoleDTO dto) {
        return service.addRole(dto);
    }

    // Get All Roles
    @GetMapping("/getall")
    @PreAuthorize("hasRole('ADMIN')")
    public List<RoleDTO> getAllRoles() {
        return service.getAllRoles();
    }

    // Get Role By ID
    @GetMapping("/get/{roleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public RoleDTO getRoleById(@PathVariable int roleId) {
        return service.getRoleById(roleId);
    }
}