package com.hexaware.careassist_claims.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.careassist_claims.dto.ClaimDocumentDTO;
import com.hexaware.careassist_claims.service.IClaimDocumentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/claim-documents")
public class ClaimDocumentRestController {

    @Autowired
    private IClaimDocumentService service;

    @PostMapping("/add")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public int addDocument(@Valid @RequestBody ClaimDocumentDTO documentDTO) {
        return service.addDocument(documentDTO);
    }

    @GetMapping("/get/{claimId}")
    @PreAuthorize("hasRole('INSURANCE_COMPANY') or hasRole('HEALTHCARE_PROVIDER') or hasRole('ADMIN') or hasRole('PATIENT')")
    public List<ClaimDocumentDTO> getDocumentsByClaimId(@PathVariable int claimId) {
        return service.getDocumentsByClaimId(claimId);
    }

    @DeleteMapping("/delete/{documentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public int deleteDocument(@PathVariable int documentId) {
        return service.deleteDocument(documentId);
    }
}