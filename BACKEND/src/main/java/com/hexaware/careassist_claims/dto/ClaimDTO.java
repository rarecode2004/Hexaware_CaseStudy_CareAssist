package com.hexaware.careassist_claims.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimDTO {

    private int claimId;

    @NotBlank
    @Pattern(regexp = "CLM[0-9]{3,10}")
    private String claimNumber;

    @NotNull
    @Min(1)
    private Integer patientId;

    @NotNull
    @Min(1)
    private Integer invoiceId;

    @NotNull
    @Min(1)
    private Integer companyId;

    @NotBlank
    @Size(min = 5, max = 200)
    private String diagnosis;

    @NotBlank
    @Size(min = 5, max = 500)
    private String treatmentDetails;

    @Positive
    private double claimAmount;

    @Pattern(regexp = "PENDING|APPROVED|REJECTED")
    private String claimStatus;
}

