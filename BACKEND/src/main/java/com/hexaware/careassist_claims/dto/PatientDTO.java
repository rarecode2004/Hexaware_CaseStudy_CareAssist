package com.hexaware.careassist_claims.dto;

import jakarta.validation.constraints.*;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDTO {

    private int patientId;

    @NotNull
    private int userId;

    @NotBlank
    private String fullName;
    
    @NotNull
    private int age;
    
    @Pattern(regexp = "MALE|FEMALE|OTHER")
    private String gender;

    @Pattern(regexp = "^[0-9]{10}$")
    private String mobile;
    
    @Size(min = 10, max = 300)
    private String address;
}