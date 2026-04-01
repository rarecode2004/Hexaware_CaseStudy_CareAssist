package com.hexaware.careassist_claims.service;

import java.util.List;

import com.hexaware.careassist_claims.dto.InsurancePlanDTO;

public interface IInsurancePlanService {

    int addPlan(InsurancePlanDTO planDTO);

    List<InsurancePlanDTO> getAllPlans();

    InsurancePlanDTO getPlanById(int planId);

    List<InsurancePlanDTO> getPlansByCompanyId(int companyId);

    int updatePlan(InsurancePlanDTO planDTO);

    int deletePlan(int planId);
}