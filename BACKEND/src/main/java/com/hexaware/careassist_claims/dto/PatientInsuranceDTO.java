package com.hexaware.careassist_claims.dto;

import java.util.Date;

import jakarta.validation.constraints.*;
import lombok.*;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientInsuranceDTO {

    private int id;

    @NotNull
    private int patientId;

    @NotNull
    private int planId;

    @NotBlank
    @Pattern(regexp = "POL[0-9]{3,10}")
    private String policyNumber;

    private Date startDate;
    private Date endDate;
    @Pattern(regexp = "ACTIVE|EXPIRED|CANCELLED")
    private String status;
}