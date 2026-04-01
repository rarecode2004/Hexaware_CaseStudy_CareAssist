package com.hexaware.careassist_claims.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "healthcare_providers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthcareProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int providerId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String providerName;

    private String contactNumber;

    private String address;
}