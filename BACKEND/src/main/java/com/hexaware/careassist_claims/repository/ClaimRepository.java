package com.hexaware.careassist_claims.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.careassist_claims.entity.Claim;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Integer> {

    Optional<Claim> findByClaimNumber(String claimNumber);

    List<Claim> findByPatient_PatientId(int patientId);

}