package com.hexaware.careassist_claims.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int invoiceId;

    private String invoiceNumber;

    @Temporal(TemporalType.DATE)
    private Date invoiceDate;

    @Temporal(TemporalType.DATE)
    private Date dueDate;

    @ManyToOne
    private Patient patient;

    @ManyToOne
    private HealthcareProvider provider;

    private double consultationFee;
    private double diagnosticTestFee;
    private double scanFee;
    private double medicineFee;

    private double tax;
    private double totalAmount;

    private String status;
}