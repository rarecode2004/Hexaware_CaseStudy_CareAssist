package com.hexaware.careassist_claims.dto;

import java.util.Date;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {

    private int paymentId;

    @NotNull
    private int claimId;

    @Positive
    private double paymentAmount;
    @Pattern(regexp = "SUCCESS|FAILED")
    private String paymentStatus;

    private Date paymentDate;
}