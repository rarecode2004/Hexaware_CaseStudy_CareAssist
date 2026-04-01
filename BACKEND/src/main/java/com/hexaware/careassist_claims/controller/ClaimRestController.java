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

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;

import com.hexaware.careassist_claims.dto.ClaimDTO;
import com.hexaware.careassist_claims.service.IClaimService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/claims")
public class ClaimRestController {

    @Autowired
    private IClaimService service;

    @PostMapping("/add")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public int addClaim(@Valid @RequestBody ClaimDTO claimDTO) {
        return service.addClaim(claimDTO);
    }
    
    
    @PostMapping("/add-with-docs")
    @PreAuthorize("hasRole('PATIENT')")
    public String addClaimWithDocs(
            @RequestParam int patientId,
            @RequestParam int invoiceId,
            @RequestParam int companyId,
            @RequestParam String diagnosis,
            @RequestParam String treatmentDetails,
            @RequestParam double claimAmount,
            @RequestParam("files") List<MultipartFile> files) {

        service.addClaimWithDocuments(
                patientId, invoiceId, companyId,
                diagnosis, treatmentDetails, claimAmount, files
        );

        return "Claim submitted successfully";
    }
    

    @GetMapping("/getall")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSURANCE_COMPANY')")
    public List<ClaimDTO> getAllClaims() {
        return service.getAllClaims();
    }

    @GetMapping("/get/{claimId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN') or hasRole('INSURANCE_COMPANY')")
    public ClaimDTO getClaimById(@PathVariable int claimId) {
        return service.getClaimById(claimId);
    }

    @GetMapping("/get/number/{claimNumber}")
    @PreAuthorize("hasRole('INSURANCE_COMPANY') or hasRole('ADMIN')")
    public ClaimDTO getClaimByNumber(@PathVariable String claimNumber) {
        return service.getClaimByNumber(claimNumber);
    }

    @GetMapping("/get/patient/{patientId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('INSURANCE_COMPANY') or hasRole('ADMIN')")
    public List<ClaimDTO> getClaimsByPatientId(@PathVariable int patientId) {
        return service.getClaimsByPatientId(patientId);
    }

    @PutMapping("/update/{claimId}/{status}")
    @PreAuthorize("hasRole('INSURANCE_COMPANY') or hasRole('ADMIN')")
    public int updateClaimStatus(@PathVariable int claimId, @PathVariable String status) {
        return service.updateClaimStatus(claimId, status);
    }

    @DeleteMapping("/delete/{claimId}")
    @PreAuthorize("hasRole('ADMIN')")
    public int deleteClaim(@PathVariable int claimId) {
        return service.deleteClaim(claimId);
    }
}