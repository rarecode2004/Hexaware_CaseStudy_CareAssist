package com.hexaware.careassist_claims.service;

import java.util.List;
import com.hexaware.careassist_claims.dto.UserDTO;

public interface IUserService {

    int addUser(UserDTO dto);

    List<UserDTO> getAllUsers();

    UserDTO getUserById(int userId);

    UserDTO getUserByEmail(String email);

    int updateUser(UserDTO dto);

    int deleteUser(int userId);
    
    int updateOwnProfile(UserDTO dto);
}