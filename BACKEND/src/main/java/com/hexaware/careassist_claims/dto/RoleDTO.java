package com.hexaware.careassist_claims.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO {

    private int roleId;

    @NotBlank
    private String roleName;
}