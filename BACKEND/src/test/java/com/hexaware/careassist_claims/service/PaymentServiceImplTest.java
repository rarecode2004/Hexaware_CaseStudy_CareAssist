package com.hexaware.careassist_claims.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.careassist_claims.dto.PaymentDTO;
import com.hexaware.careassist_claims.dto.ClaimDTO;

@SpringBootTest
class PaymentServiceImplTest {

    @Autowired
    private IPaymentService paymentService;

    @Autowired
    private IClaimService claimService;

    @Test
    void testAddPayment() {

        ClaimDTO claim = claimService.getClaimById(1);
        assertNotNull(claim);

        PaymentDTO payment = new PaymentDTO();
        payment.setClaimId(claim.getClaimId());
        payment.setPaymentAmount(5000);
        payment.setPaymentStatus("Pending");

        int result = paymentService.addPayment(payment);

        assertEquals(1, result);
    }

    @Test
    void testGetPaymentsByClaimId() {

        List<PaymentDTO> list = paymentService.getPaymentsByClaimId(1);

        assertNotNull(list);
    }

    @Test
    void testGetPaymentById() {

        PaymentDTO payment = paymentService.getPaymentById(1);

        assertNotNull(payment);
    }

    @Test
    void testUpdatePaymentStatus() {

        int paymentId = 1;

        int result = paymentService.updatePaymentStatus(paymentId, "Completed");

        assertEquals(1, result);

        PaymentDTO updated = paymentService.getPaymentById(paymentId);

        assertEquals("Completed", updated.getPaymentStatus());
    }

    @Test
    void testDeletePayment() {

        int paymentId = 1;

        int result = paymentService.deletePayment(paymentId);

        assertEquals(1, result);

        PaymentDTO deleted = paymentService.getPaymentById(paymentId);

        assertNull(deleted);
    }
}