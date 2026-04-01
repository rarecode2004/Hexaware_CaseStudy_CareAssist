package com.hexaware.careassist_claims.service.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendLoginEmail(String toEmail) {
        sendSimpleMail(toEmail, "Login Successful", "You have logged in successfully.");
    }

    @Override
    public void sendClaimSubmittedEmail(String toEmail) {
        sendSimpleMail(toEmail, "Claim Submitted", "Your claim has been submitted successfully.");
    }

    @Override
    public void sendClaimStatusEmail(String toEmail, String status) {
        sendSimpleMail(toEmail, "Claim Status Update", "Your claim is " + status);
    }

    @Override
    public void sendPaymentEmail(String toEmail) {
        sendSimpleMail(toEmail, "Payment Success", "Your payment has been processed.");
    }

    @Override
    public void sendInvoiceEmail(String toEmail, byte[] pdfData) {

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Invoice Generated");
            helper.setText("Please find your invoice attached.");

            helper.addAttachment("invoice.pdf", new ByteArrayResource(pdfData));

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Email sending failed");
        }
    }

    private void sendSimpleMail(String to, String subject, String text) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Email failed");
        }
    }
}