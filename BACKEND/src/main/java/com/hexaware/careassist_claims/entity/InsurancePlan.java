package com.hexaware.careassist_claims.entity;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "insurance_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsurancePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int planId;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private InsuranceCompany company;

    private String planName;

    private String coverageDetails;

    private double maxCoverageAmount;

    private double premiumAmount;
}