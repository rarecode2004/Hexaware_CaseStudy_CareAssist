package com.hexaware.careassist_claims.entity;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int patientId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String fullName;

    private String gender;
    
    private int age;

    private String mobile;

    private String address;
    
}