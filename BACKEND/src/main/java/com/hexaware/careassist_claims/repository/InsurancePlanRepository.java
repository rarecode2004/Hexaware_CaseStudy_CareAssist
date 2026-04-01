package com.hexaware.careassist_claims.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.careassist_claims.entity.InsurancePlan;

@Repository
public interface InsurancePlanRepository extends JpaRepository<InsurancePlan, Integer> {

    List<InsurancePlan> findByCompany_CompanyId(int companyId);

}