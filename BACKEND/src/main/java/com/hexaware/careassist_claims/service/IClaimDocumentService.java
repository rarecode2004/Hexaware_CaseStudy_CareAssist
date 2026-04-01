package com.hexaware.careassist_claims.service;

import java.util.List;

import com.hexaware.careassist_claims.dto.ClaimDocumentDTO;

public interface IClaimDocumentService {

    int addDocument(ClaimDocumentDTO documentDTO);

    List<ClaimDocumentDTO> getDocumentsByClaimId(int claimId);

    int deleteDocument(int documentId);
}