package com.hexaware.careassist_claims.service.notification;

public interface EmailService {

    void sendLoginEmail(String toEmail);

    void sendClaimSubmittedEmail(String toEmail);

    void sendClaimStatusEmail(String toEmail, String status);

    void sendPaymentEmail(String toEmail);

    void sendInvoiceEmail(String toEmail, byte[] pdfData);
}