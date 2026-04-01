package com.hexaware.careassist_claims.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.careassist_claims.dto.PaymentDTO;
import com.hexaware.careassist_claims.entity.Claim;
import com.hexaware.careassist_claims.entity.Payment;
import com.hexaware.careassist_claims.repository.ClaimRepository;
import com.hexaware.careassist_claims.repository.PaymentRepository;
import com.hexaware.careassist_claims.service.notification.EmailService;

@Service
@Transactional
public class PaymentServiceImpl implements IPaymentService {

    @Autowired
    private PaymentRepository repo;

    @Autowired
    private ClaimRepository claimRepo;
    
    @Autowired
    private EmailService emailService;

    // ================== ADD PAYMENT ==================
    @Override
    public int addPayment(PaymentDTO dto) {

        Payment payment = mapToEntity(dto);

        repo.save(payment);

        // 🔥 EMAIL: PAYMENT SUCCESS
        String email = payment.getClaim()
                              .getPatient()
                              .getUser()
                              .getEmail();

        emailService.sendPaymentEmail(email);

        return 1;
    }

    // ================== GET PAYMENTS BY CLAIM ==================
    @Override
    public List<PaymentDTO> getPaymentsByClaimId(int claimId) {

        return repo.findByClaim_ClaimId(claimId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== GET PAYMENT BY ID ==================
    @Override
    public PaymentDTO getPaymentById(int paymentId) {

        Payment payment = repo.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return mapToDTO(payment);
    }

    // ================== UPDATE PAYMENT STATUS ==================
    @Override
    public int updatePaymentStatus(int paymentId, String status) {
    	if (!status.matches("SUCCESS|FAILED")) {
            throw new RuntimeException("Invalid status!, should be only SUCCESS|FAILED");
        }

        Payment payment = repo.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setPaymentStatus(status);

        repo.save(payment);
        return 1;
    }

    // ================== DELETE PAYMENT ==================
    @Override
    public int deletePayment(int paymentId) {

        if (!repo.existsById(paymentId)) {
            throw new RuntimeException("Payment not found");
        }

        repo.deleteById(paymentId);
        return 1;
    }

    // ================== MAPPING METHODS ==================

    // 🔁 Entity → DTO
    private PaymentDTO mapToDTO(Payment payment) {

        PaymentDTO dto = new PaymentDTO();

        dto.setPaymentId(payment.getPaymentId());
        dto.setPaymentAmount(payment.getPaymentAmount());
        dto.setPaymentStatus(payment.getPaymentStatus());

        // ✅ ADD THIS
        dto.setPaymentDate(payment.getPaymentDate());

        // 🔥 connection mapping
        if (payment.getClaim() != null) {
            dto.setClaimId(payment.getClaim().getClaimId());
        }

        return dto;
    }

    // 🔁 DTO → Entity
    private Payment mapToEntity(PaymentDTO dto) {

        Payment payment = new Payment();

        payment.setPaymentAmount(dto.getPaymentAmount());
        payment.setPaymentStatus(dto.getPaymentStatus());

        // ✅ ADD THIS
        payment.setPaymentDate(dto.getPaymentDate());

        // 🔥 connection
        Claim claim = claimRepo.findById(dto.getClaimId())
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        payment.setClaim(claim);

        return payment;
    }
}