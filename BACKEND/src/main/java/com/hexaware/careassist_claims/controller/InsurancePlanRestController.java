package com.hexaware.careassist_claims.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.careassist_claims.dto.InsurancePlanDTO;
import com.hexaware.careassist_claims.service.IInsurancePlanService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/plans")
public class InsurancePlanRestController {

    @Autowired
    private IInsurancePlanService service;

    // Add Plan
    @PostMapping("/add")
    @PreAuthorize("hasRole('INSURANCE_COMPANY') or hasRole('ADMIN')")
    public int addPlan(@Valid @RequestBody InsurancePlanDTO planDTO) {
        return service.addPlan(planDTO);
    }

    // Get All Plans
    @GetMapping("/getall")
    @PreAuthorize("hasRole('PATIENT') or hasRole('HEALTHCARE_PROVIDER') or hasRole('ADMIN')")
    public List<InsurancePlanDTO> getAllPlans() {
        return service.getAllPlans();
    }

    // Get Plan By ID
    @GetMapping("/get/{planId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('HEALTHCARE_PROVIDER') or hasRole('ADMIN')")
    public InsurancePlanDTO getPlanById(@PathVariable int planId) {
        return service.getPlanById(planId);
    }

    // Get Plans By Company ID
    @GetMapping("/get/company/{companyId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN') or hasRole('INSURANCE_COMPANY')")
    public List<InsurancePlanDTO> getPlansByCompanyId(@PathVariable int companyId) {
        return service.getPlansByCompanyId(companyId);
    }

    // Update Plan
    @PutMapping("/update")
    @PreAuthorize("hasRole('INSURANCE_COMPANY') or hasRole('ADMIN')")
    public int updatePlan(@Valid @RequestBody InsurancePlanDTO planDTO) {
        return service.updatePlan(planDTO);
    }

    // Delete Plan
    @DeleteMapping("/delete/{planId}")
    @PreAuthorize("hasRole('ADMIN')")
    public int deletePlan(@PathVariable int planId) {
        return service.deletePlan(planId);
    }
}