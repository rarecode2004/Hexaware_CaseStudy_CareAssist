package com.hexaware.careassist_claims.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
@Entity
@Table(name = "patient_insurance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientInsurance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private Patient patient;

    @ManyToOne
    private InsurancePlan plan;

    private String policyNumber;

    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    private Date endDate;

    private String status;
}