package com.hexaware.careassist_claims.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.careassist_claims.entity.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {
	
	Optional<Patient> findByUser_UserId(int userId);
}