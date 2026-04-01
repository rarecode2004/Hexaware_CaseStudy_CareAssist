package com.hexaware.careassist_claims.service;

import java.util.List;
import com.hexaware.careassist_claims.dto.PaymentDTO;

public interface IPaymentService {

    int addPayment(PaymentDTO dto);

    List<PaymentDTO> getPaymentsByClaimId(int claimId);

    PaymentDTO getPaymentById(int paymentId);

    int updatePaymentStatus(int paymentId, String status);

    int deletePayment(int paymentId);
}