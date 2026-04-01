package com.hexaware.careassist_claims.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthcareProviderDTO {

    private int providerId;

    @NotNull
    @Min(1)
    private Integer userId;

    @NotBlank
    @Size(min = 3, max = 100)
    private String providerName;

    @NotBlank
    @Pattern(regexp = "^[6-9][0-9]{9}$")
    private String contactNumber;

    @NotBlank
    @Size(min = 10, max = 500)
    private String address;
}
