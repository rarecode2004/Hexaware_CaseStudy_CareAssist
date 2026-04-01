package com.hexaware.careassist_claims.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.careassist_claims.dto.RoleDTO;
import com.hexaware.careassist_claims.dto.UserDTO;

@SpringBootTest
class UserServiceImplTest {

    @Autowired
    private IUserService userService;

    @Autowired
    private IRoleService roleService;

    @Test
    void testAddUser() {

        RoleDTO role = new RoleDTO();
        role.setRoleName("TestRole");
        roleService.addRole(role);

        UserDTO user = new UserDTO();
        user.setEmail("abc@example.com");
        user.setPassword("password123");
        user.setRoleId(role.getRoleId());

        int result = userService.addUser(user);

        assertEquals(1, result);

        UserDTO savedUser = userService.getUserById(user.getUserId());

        assertNotNull(savedUser);
        assertEquals("abc@example.com", savedUser.getEmail());
    }

    @Test
    void testGetAllUsers() {

        List<UserDTO> list = userService.getAllUsers();

        assertNotNull(list);
        assertTrue(list.size() >= 0);
    }

    @Test
    void testGetUserById() {

        int id = 5;

        UserDTO user = userService.getUserById(id);

        assertNotNull(user);
    }

    @Test
    void testGetUserByEmail() {

        UserDTO user = userService.getUserByEmail("abc@example.com");

        assertNotNull(user);
        assertEquals("abc@example.com", user.getEmail());
    }

    @Test
    void testUpdateUser() {

        UserDTO user = userService.getUserByEmail("abc@example.com");

        user.setPassword("newpassword");

        int result = userService.updateUser(user);

        assertEquals(1, result);

        UserDTO updated = userService.getUserById(user.getUserId());

        assertEquals("newpassword", updated.getPassword());
    }

    @Test
    void testDeleteUser() {

        UserDTO user = userService.getUserByEmail("abc@example.com");

        int result = userService.deleteUser(user.getUserId());

        assertEquals(1, result);

        UserDTO deleted = userService.getUserById(user.getUserId());

        assertNull(deleted);
    }
}