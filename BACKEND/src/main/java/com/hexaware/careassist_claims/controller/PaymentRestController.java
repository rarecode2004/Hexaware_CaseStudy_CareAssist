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

import com.hexaware.careassist_claims.dto.PaymentDTO;
import com.hexaware.careassist_claims.service.IPaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/payments")
public class PaymentRestController {

    @Autowired
    private IPaymentService service;

    // Add Payment
    @PostMapping("/add")
    @PreAuthorize("hasRole('INSURANCE_COMPANY') or hasRole('ADMIN')")
    public int addPayment(@Valid @RequestBody PaymentDTO dto) {
        return service.addPayment(dto);
    }

    // Get Payment By ID
    @GetMapping("/get/{paymentId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public PaymentDTO getPaymentById(@PathVariable int paymentId) {
        return service.getPaymentById(paymentId);
    }

    // Get Payments By Claim ID
    @GetMapping("/get/payments/{claimId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public List<PaymentDTO> getPaymentsByClaimId(@PathVariable int claimId) {
        return service.getPaymentsByClaimId(claimId);
    }

    // Update Payment Status
    @PutMapping("/update/{paymentId}/{status}")
    @PreAuthorize("hasRole('INSURANCE_COMPANY') or hasRole('ADMIN')")
    public int updatePaymentStatus(@PathVariable int paymentId, @PathVariable String status) {
        return service.updatePaymentStatus(paymentId, status);
    }

    // Delete Payment
    @DeleteMapping("/delete/{paymentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public int deletePayment(@PathVariable int paymentId) {
        return service.deletePayment(paymentId);
    }
}