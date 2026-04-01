package com.hexaware.careassist_claims.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.careassist_claims.dto.ClaimDTO;
import com.hexaware.careassist_claims.dto.ClaimDocumentDTO;

@SpringBootTest
class ClaimDocumentServiceImplTest {

    @Autowired
    private IClaimDocumentService service;

    @Autowired
    private IClaimService claimService;

    @Test
    void testAddDocument() {

        // first create claim
        ClaimDTO claim = new ClaimDTO();
        claim.setClaimNumber("DOC100");
        claim.setClaimStatus("PENDING");

        claimService.addClaim(claim);

        ClaimDTO savedClaim = claimService.getClaimByNumber("DOC100");

        // create document
        ClaimDocumentDTO doc = new ClaimDocumentDTO();
        doc.setFileName("report.pdf");
        doc.setFilePath("uploads/report.pdf");
        doc.setClaimId(savedClaim.getClaimId());

        int result = service.addDocument(doc);

        assertEquals(1, result);
    }

    @Test
    void testGetDocumentsByClaimId() {

        List<ClaimDocumentDTO> docs = service.getDocumentsByClaimId(1);

        assertNotNull(docs);
    }

    @Test
    void testDeleteDocument() {

        int result = service.deleteDocument(1);

        assertEquals(1, result);
    }
}