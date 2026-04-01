package com.hexaware.careassist_claims.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paymentId;

    @ManyToOne
    private Claim claim;

    private double paymentAmount;

    private String paymentStatus;

    @Temporal(TemporalType.DATE)
    private Date paymentDate;
}