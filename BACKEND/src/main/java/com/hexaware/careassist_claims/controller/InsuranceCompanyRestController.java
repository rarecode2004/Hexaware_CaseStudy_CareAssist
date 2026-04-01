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

import com.hexaware.careassist_claims.dto.InsuranceCompanyDTO;
import com.hexaware.careassist_claims.service.IInsuranceCompanyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/insurance-companies")
public class InsuranceCompanyRestController {

    @Autowired
    private IInsuranceCompanyService service;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSURANCE_COMPANY')")
    public int addCompany(@Valid @RequestBody InsuranceCompanyDTO companyDTO) {
        return service.addCompany(companyDTO);
    }

    @GetMapping("/getall")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PATIENT')")
    public List<InsuranceCompanyDTO> getAllCompanies() {
        return service.getAllCompanies();
    }

    @GetMapping("/get/{companyId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSURANCE_COMPANY') or hasRole('PATIENT')")
    public InsuranceCompanyDTO getCompanyById(@PathVariable int companyId) {
        return service.getCompanyById(companyId);
    }

    @GetMapping("/get/user/{userId}")
    @PreAuthorize("hasRole('INSURANCE_COMPANY') or hasRole('ADMIN')")
    public InsuranceCompanyDTO getCompanyByUserId(@PathVariable int userId) {
        return service.getCompanyByUserId(userId);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('INSURANCE_COMPANY') or hasRole('ADMIN')")
    public int updateCompany(@Valid @RequestBody InsuranceCompanyDTO companyDTO) {
        return service.updateCompany(companyDTO);
    }

    @DeleteMapping("/delete/{companyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public int deleteCompany(@PathVariable int companyId) {
        return service.deleteCompany(companyId);
    }
}