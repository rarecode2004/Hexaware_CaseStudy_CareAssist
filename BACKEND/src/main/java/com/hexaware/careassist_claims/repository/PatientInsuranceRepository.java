package com.hexaware.careassist_claims.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.careassist_claims.entity.PatientInsurance;

@Repository
public interface PatientInsuranceRepository 
        extends JpaRepository<PatientInsurance, Integer> {

    List<PatientInsurance> findByPatient_PatientId(int patientId);

}