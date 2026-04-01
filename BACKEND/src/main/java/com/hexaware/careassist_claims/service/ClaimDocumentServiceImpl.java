package com.hexaware.careassist_claims.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.careassist_claims.dto.ClaimDocumentDTO;
import com.hexaware.careassist_claims.entity.Claim;
import com.hexaware.careassist_claims.entity.ClaimDocument;
import com.hexaware.careassist_claims.repository.ClaimDocumentRepository;
import com.hexaware.careassist_claims.repository.ClaimRepository;

@Service
@Transactional
public class ClaimDocumentServiceImpl implements IClaimDocumentService {

    @Autowired
    private ClaimDocumentRepository repo;

    @Autowired
    private ClaimRepository claimRepo;

    // ================== ADD DOCUMENT ==================
    @Override
    public int addDocument(ClaimDocumentDTO dto) {

        ClaimDocument doc = mapToEntity(dto);

        repo.save(doc);
        return 1;
    }

    // ================== GET BY CLAIM ==================
    @Override
    public List<ClaimDocumentDTO> getDocumentsByClaimId(int claimId) {

        return repo.findByClaim_ClaimId(claimId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== DELETE ==================
    @Override
    public int deleteDocument(int documentId) {

        if (!repo.existsById(documentId)) {
            throw new RuntimeException("Document not found");
        }

        repo.deleteById(documentId);
        return 1;
    }

    // ================== MAPPING ==================

    private ClaimDocumentDTO mapToDTO(ClaimDocument doc) {

        ClaimDocumentDTO dto = new ClaimDocumentDTO();

        dto.setDocumentId(doc.getDocumentId());
        dto.setFileName(doc.getFileName());

        // ✅ ADD THESE
        dto.setFilePath(doc.getFilePath());
        dto.setData(doc.getData());

        if (doc.getClaim() != null) {
            dto.setClaimId(doc.getClaim().getClaimId());
        }

        return dto;
    }

    private ClaimDocument mapToEntity(ClaimDocumentDTO dto) {

        ClaimDocument doc = new ClaimDocument();

        doc.setFileName(dto.getFileName());

        doc.setFilePath(dto.getFilePath());
        doc.setData(dto.getData());

        // 🔥 connection
        Claim claim = claimRepo.findById(dto.getClaimId())
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        doc.setClaim(claim);

        return doc;
    }
}