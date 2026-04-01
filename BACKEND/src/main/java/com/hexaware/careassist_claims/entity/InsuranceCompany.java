package com.hexaware.careassist_claims.entity;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "insurance_companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceCompany {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int companyId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String companyName;

    private String address;

    private String contactEmail;

    private String contactPhone;
}