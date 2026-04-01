package com.hexaware.careassist_claims.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {

    @NotBlank
    private String username;  // you can also accept email if needed

    @NotBlank
    private String password;
}