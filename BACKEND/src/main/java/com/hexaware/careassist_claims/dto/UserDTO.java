package com.hexaware.careassist_claims.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private int userId;

    @NotBlank
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;

    @NotBlank
    private String username; // if you want username field for login

    @NotNull(message = "Role ID is required")
    @Min(value = 1, message = "Role ID must be >= 1")
    private Integer roleId; // maps to Role entity
}