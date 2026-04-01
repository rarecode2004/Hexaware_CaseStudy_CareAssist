package com.hexaware.careassist_claims.dto;

import java.util.Date;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {

    private int invoiceId;

    @NotBlank
    @Pattern(regexp = "INV[0-9]{3,10}")

    private String invoiceNumber;

    private Date invoiceDate;
    private Date dueDate;

    @NotNull
    private int patientId;

    @NotNull
    private int providerId;

    @PositiveOrZero
    private double consultationFee;

    @PositiveOrZero
    private double diagnosticTestFee;

    @PositiveOrZero
    private double scanFee;

    @PositiveOrZero
    private double medicineFee;

    private double tax;
    private double totalAmount;
    @Pattern(regexp = "PENDING|PAID|OVERDUE")
    private String status;
}