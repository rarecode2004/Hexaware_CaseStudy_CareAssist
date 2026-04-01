package com.hexaware.careassist_claims.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.careassist_claims.entity.HealthcareProvider;

@Repository
public interface HealthcareProviderRepository 
        extends JpaRepository<HealthcareProvider, Integer> {

    Optional<HealthcareProvider> findByUser_UserId(int userId);

}