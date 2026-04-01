package com.hexaware.careassist_claims.service.notification;

import java.io.ByteArrayOutputStream;


import org.springframework.stereotype.Service;

import com.hexaware.careassist_claims.entity.Invoice;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.Document;
@Service
public class PdfServiceImpl implements PdfService {

    @Override
    public byte[] generateInvoicePdf(Invoice invoice) {

        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph("INVOICE"));
            document.add(new Paragraph("Invoice No: " + invoice.getInvoiceNumber()));
            document.add(new Paragraph("Patient: " + invoice.getPatient().getFullName()));
            document.add(new Paragraph("Amount: " + invoice.getTotalAmount()));
            document.add(new Paragraph("Status: " + invoice.getStatus()));

            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed");
        }
    }
}