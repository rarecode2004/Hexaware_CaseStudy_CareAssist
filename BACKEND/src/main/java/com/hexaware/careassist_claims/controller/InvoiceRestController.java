package com.hexaware.careassist_claims.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.hexaware.careassist_claims.dto.InvoiceDTO;
import com.hexaware.careassist_claims.service.IInvoiceService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/invoices")
public class InvoiceRestController {

    @Autowired
    private IInvoiceService service;

    @PostMapping("/add")
    @PreAuthorize("hasRole('HEALTHCARE_PROVIDER') or hasRole('ADMIN')")
    public int addInvoice(@Valid @RequestBody InvoiceDTO invoiceDTO) {
        return service.addInvoice(invoiceDTO);
    }

    @GetMapping("/getall")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HEALTHCARE_PROVIDER')")
    public List<InvoiceDTO> getAllInvoices() {
        return service.getAllInvoices();
    }

    @GetMapping("/get/{invoiceId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN') or hasRole('HEALTHCARE_PROVIDER') or hasRole('INSURANCE_COMPANY')")
    public InvoiceDTO getInvoiceById(@PathVariable int invoiceId) {
        return service.getInvoiceById(invoiceId);
    }

    @GetMapping("/get/number/{invoiceNumber}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN') or hasRole('HEALTHCARE_PROVIDER')")
    public InvoiceDTO getInvoiceByNumber(@PathVariable String invoiceNumber) {
        return service.getInvoiceByNumber(invoiceNumber);
    }

    @GetMapping("/get/patient/{patientId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN') or hasRole('HEALTHCARE_PROVIDER')")
    public List<InvoiceDTO> getInvoicesByPatientId(@PathVariable int patientId) {
        return service.getInvoicesByPatientId(patientId);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('HEALTHCARE_PROVIDER') or hasRole('ADMIN') or hasRole('PATIENT')")
    public int updateInvoice(@Valid @RequestBody InvoiceDTO invoiceDTO) {
        return service.updateInvoice(invoiceDTO);
    }

    @DeleteMapping("/delete/{invoiceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public int deleteInvoice(@PathVariable int invoiceId) {
        return service.deleteInvoice(invoiceId);
    }
}