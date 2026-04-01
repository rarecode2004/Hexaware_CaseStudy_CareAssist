package com.hexaware.careassist_claims.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.careassist_claims.dto.ClaimDTO;

@SpringBootTest
class ClaimServiceImplTest {

    @Autowired
    private IClaimService service;

    @Test
    void testAddClaim() {

        ClaimDTO claim = new ClaimDTO();
        claim.setClaimNumber("CLM999");
        claim.setClaimStatus("PENDING");

        int result = service.addClaim(claim);

        assertEquals(1, result);
    }

    @Test
    void testGetAllClaims() {

        List<ClaimDTO> claims = service.getAllClaims();

        assertNotNull(claims);
        assertTrue(claims.size() >= 0);
    }

    @Test
    void testGetClaimById() {

        ClaimDTO claim = service.getClaimById(1);

        assertNotNull(claim);
    }

    @Test
    void testGetClaimByNumber() {

        ClaimDTO claim = service.getClaimByNumber("CLM999");

        assertNotNull(claim);
    }

    @Test
    void testGetClaimsByPatientId() {

        List<ClaimDTO> claims = service.getClaimsByPatientId(1);

        assertNotNull(claims);
    }

    @Test
    void testUpdateClaimStatus() {

        int result = service.updateClaimStatus(1, "APPROVED");

        assertEquals(1, result);
    }

    @Test
    void testDeleteClaim() {

        int result = service.deleteClaim(1);

        assertEquals(1, result);
    }
}