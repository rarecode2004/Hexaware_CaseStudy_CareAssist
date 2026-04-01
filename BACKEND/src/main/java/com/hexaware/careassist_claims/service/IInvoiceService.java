package com.hexaware.careassist_claims.service;

import java.util.List;

import com.hexaware.careassist_claims.dto.InvoiceDTO;

public interface IInvoiceService {

    int addInvoice(InvoiceDTO invoiceDTO);

    List<InvoiceDTO> getAllInvoices();

    InvoiceDTO getInvoiceById(int invoiceId);

    InvoiceDTO getInvoiceByNumber(String invoiceNumber);

    List<InvoiceDTO> getInvoicesByPatientId(int patientId);

    int updateInvoice(InvoiceDTO invoiceDTO);

    int deleteInvoice(int invoiceId);
}