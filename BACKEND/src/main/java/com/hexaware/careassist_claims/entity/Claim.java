package com.hexaware.careassist_claims.entity;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "claims")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int claimId;

    private String claimNumber;

    @ManyToOne
    private Patient patient;

    @ManyToOne
    private Invoice invoice;

    @ManyToOne
    private InsuranceCompany insuranceCompany;

    private String diagnosis;
    private String treatmentDetails;

    private double claimAmount;

    private String claimStatus;
}