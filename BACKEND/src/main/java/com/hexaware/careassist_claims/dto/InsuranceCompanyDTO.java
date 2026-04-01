package com.hexaware.careassist_claims.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceCompanyDTO {

    private int companyId;

    @NotNull
    @Min(1)
    private Integer userId;

    @NotBlank
    @Size(min = 3, max = 150)
    private String companyName;

    @NotBlank
    @Size(min = 10, max = 500)
    private String address;

    @Email
    @NotBlank
    private String contactEmail;

    @Pattern(regexp = "^[6-9][0-9]{9}$")
    @NotBlank
    private String contactPhone;
}

