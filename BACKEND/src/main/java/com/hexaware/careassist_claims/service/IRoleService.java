package com.hexaware.careassist_claims.service;

import java.util.List;
import com.hexaware.careassist_claims.dto.RoleDTO;

public interface IRoleService {

    int addRole(RoleDTO dto);

    List<RoleDTO> getAllRoles();

    RoleDTO getRoleById(int roleId);
    
    int deleteRole(int roleId);
}