package com.hexaware.careassist_claims.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.careassist_claims.dto.InsurancePlanDTO;
import com.hexaware.careassist_claims.entity.InsuranceCompany;
import com.hexaware.careassist_claims.entity.InsurancePlan;
import com.hexaware.careassist_claims.repository.InsuranceCompanyRepository;
import com.hexaware.careassist_claims.repository.InsurancePlanRepository;

@Service
@Transactional
public class InsurancePlanServiceImpl implements IInsurancePlanService {

    @Autowired
    private InsurancePlanRepository repo;

    @Autowired
    private InsuranceCompanyRepository companyRepo;

    // ================== ADD ==================
    @Override
    public int addPlan(InsurancePlanDTO dto) {

        InsurancePlan plan = mapToEntity(dto);

        repo.save(plan);
        return 1;
    }

    // ================== GET ALL ==================
    @Override
    public List<InsurancePlanDTO> getAllPlans() {

        return repo.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== GET BY ID ==================
    @Override
    public InsurancePlanDTO getPlanById(int planId) {

        InsurancePlan plan = repo.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        return mapToDTO(plan);
    }

    // ================== GET BY COMPANY ==================
    @Override
    public List<InsurancePlanDTO> getPlansByCompanyId(int companyId) {

        return repo.findByCompany_CompanyId(companyId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== UPDATE ==================
    @Override
    public int updatePlan(InsurancePlanDTO dto) {

        InsurancePlan plan = repo.findById(dto.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        plan.setPlanName(dto.getPlanName());
        plan.setMaxCoverageAmount(dto.getMaxCoverageAmount());
        plan.setPremiumAmount(dto.getPremiumAmount());

        // 🔥 relationship
        InsuranceCompany company = companyRepo.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        plan.setCompany(company);

        repo.save(plan);
        return 1;
    }

    // ================== DELETE ==================
    @Override
    public int deletePlan(int planId) {

        if (!repo.existsById(planId)) {
            throw new RuntimeException("Plan not found");
        }

        repo.deleteById(planId);
        return 1;
    }

    // ================== MAPPING ==================

    private InsurancePlanDTO mapToDTO(InsurancePlan plan) {

        InsurancePlanDTO dto = new InsurancePlanDTO();

        dto.setPlanId(plan.getPlanId());
        dto.setPlanName(plan.getPlanName());
        dto.setMaxCoverageAmount(plan.getMaxCoverageAmount());
        dto.setPremiumAmount(plan.getPremiumAmount());

        // ✅ ADD THIS
        dto.setCoverageDetails(plan.getCoverageDetails());

        if (plan.getCompany() != null) {
            dto.setCompanyId(plan.getCompany().getCompanyId());
        }

        return dto;
    }

    private InsurancePlan mapToEntity(InsurancePlanDTO dto) {

        InsurancePlan plan = new InsurancePlan();

        plan.setPlanName(dto.getPlanName());
        plan.setMaxCoverageAmount(dto.getMaxCoverageAmount());
        plan.setPremiumAmount(dto.getPremiumAmount());

        // ✅ ADD THIS
        plan.setCoverageDetails(dto.getCoverageDetails());

        // 🔥 relationship
        InsuranceCompany company = companyRepo.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        plan.setCompany(company);

        return plan;
    }
}