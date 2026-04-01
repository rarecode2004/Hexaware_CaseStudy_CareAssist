package com.hexaware.careassist_claims.dto;

import jakarta.validation.constraints.*;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsurancePlanDTO {

    private int planId;

    @NotNull
    private int companyId;

    @NotBlank
    @Size(min = 3, max = 150)
    private String planName;

    private String coverageDetails;

    @Positive
    private double maxCoverageAmount;

    @Positive
    private double premiumAmount;
}