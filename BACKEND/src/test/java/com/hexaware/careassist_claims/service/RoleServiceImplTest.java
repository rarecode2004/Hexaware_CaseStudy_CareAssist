package com.hexaware.careassist_claims.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.careassist_claims.dto.RoleDTO;

@SpringBootTest
class RoleServiceImplTest {

    @Autowired
    private IRoleService roleService;

    @Test
    void testAddRole() {

        RoleDTO role = new RoleDTO();
        role.setRoleName("aadmin");

        int result = roleService.addRole(role);

        assertEquals(1, result);

        RoleDTO saved = roleService.getRoleById(role.getRoleId());

        assertNotNull(saved);
        assertEquals("aadmin", saved.getRoleName());
    }

    @Test
    void testGetAllRoles() {

        List<RoleDTO> list = roleService.getAllRoles();

        assertNotNull(list);
        assertTrue(list.size() >= 0);
    }

    @Test
    void testGetRoleById() {

        RoleDTO role = roleService.getRoleById(1);

        assertNotNull(role);
    }
}