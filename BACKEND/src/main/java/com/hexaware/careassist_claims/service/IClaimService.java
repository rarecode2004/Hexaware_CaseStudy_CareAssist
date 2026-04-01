package com.hexaware.careassist_claims.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.hexaware.careassist_claims.dto.ClaimDTO;

public interface IClaimService {

    int addClaim(ClaimDTO claimDTO);

    List<ClaimDTO> getAllClaims();

    ClaimDTO getClaimById(int claimId);

    ClaimDTO getClaimByNumber(String claimNumber);

    List<ClaimDTO> getClaimsByPatientId(int patientId);

    int updateClaimStatus(int claimId, String status);

    int deleteClaim(int claimId);
    
    void addClaimWithDocuments(
    	    int patientId,
    	    int invoiceId,
    	    int companyId,
    	    String diagnosis,
    	    String treatmentDetails,
    	    double claimAmount,
    	    List<MultipartFile> files
    	);
}