package com.hexaware.careassist_claims.service.notification;

import com.hexaware.careassist_claims.entity.Invoice;

public interface PdfService {

    byte[] generateInvoicePdf(Invoice invoice);
}