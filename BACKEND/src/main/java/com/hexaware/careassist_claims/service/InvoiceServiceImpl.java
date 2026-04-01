package com.hexaware.careassist_claims.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.careassist_claims.dto.InvoiceDTO;
import com.hexaware.careassist_claims.entity.HealthcareProvider;
import com.hexaware.careassist_claims.entity.Invoice;
import com.hexaware.careassist_claims.entity.Patient;
import com.hexaware.careassist_claims.repository.HealthcareProviderRepository;
import com.hexaware.careassist_claims.repository.InvoiceRepository;
import com.hexaware.careassist_claims.repository.PatientRepository;
import com.hexaware.careassist_claims.service.notification.EmailService;
import com.hexaware.careassist_claims.service.notification.PdfService;

@Service
@Transactional
public class InvoiceServiceImpl implements IInvoiceService {

    @Autowired
    private InvoiceRepository repo;

    @Autowired
    private PatientRepository patientRepo;

    @Autowired
    private HealthcareProviderRepository providerRepo;
    
    @Autowired
    private PdfService pdfService;

    @Autowired
    private EmailService emailService;

    // ================== ADD ==================
    @Override
    public int addInvoice(InvoiceDTO dto) {

        Invoice invoice = mapToEntity(dto);

        repo.save(invoice);

        // 🔥 PDF GENERATION
        byte[] pdf = pdfService.generateInvoicePdf(invoice);

        // 🔥 EMAIL SEND
        String email = invoice.getPatient().getUser().getEmail();
        emailService.sendInvoiceEmail(email, pdf);

        return 1;
    }

    // ================== GET ALL ==================
    @Override
    public List<InvoiceDTO> getAllInvoices() {

        return repo.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== GET BY ID ==================
    @Override
    public InvoiceDTO getInvoiceById(int invoiceId) {

        Invoice invoice = repo.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        return mapToDTO(invoice);
    }

    // ================== GET BY NUMBER ==================
    @Override
    public InvoiceDTO getInvoiceByNumber(String invoiceNumber) {

        Invoice invoice = repo.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        return mapToDTO(invoice);
    }

    // ================== GET BY PATIENT ==================
    @Override
    public List<InvoiceDTO> getInvoicesByPatientId(int patientId) {

        return repo.findByPatient_PatientId(patientId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== UPDATE ==================
    @Override
    public int updateInvoice(InvoiceDTO dto) {

        Invoice invoice = repo.findById(dto.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        invoice.setInvoiceNumber(dto.getInvoiceNumber());
        invoice.setTotalAmount(dto.getTotalAmount());
        invoice.setStatus(dto.getStatus());

        // 🔥 connections
        Patient patient = patientRepo.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        HealthcareProvider provider = providerRepo.findById(dto.getProviderId())
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        invoice.setPatient(patient);
        invoice.setProvider(provider);

        repo.save(invoice);
        return 1;
    }

    // ================== DELETE ==================
    @Override
    public int deleteInvoice(int invoiceId) {

        if (!repo.existsById(invoiceId)) {
            throw new RuntimeException("Invoice not found");
        }

        repo.deleteById(invoiceId);
        return 1;
    }

    // ================== MAPPING ==================

    private InvoiceDTO mapToDTO(Invoice invoice) {

        InvoiceDTO dto = new InvoiceDTO();

        dto.setInvoiceId(invoice.getInvoiceId());
        dto.setInvoiceNumber(invoice.getInvoiceNumber());
        dto.setTotalAmount(invoice.getTotalAmount());

        // ✅ ADD THESE
        dto.setInvoiceDate(invoice.getInvoiceDate());
        dto.setDueDate(invoice.getDueDate());
        dto.setConsultationFee(invoice.getConsultationFee());
        dto.setDiagnosticTestFee(invoice.getDiagnosticTestFee());
        dto.setScanFee(invoice.getScanFee());
        dto.setMedicineFee(invoice.getMedicineFee());
        dto.setTax(invoice.getTax());
        dto.setStatus(invoice.getStatus());

        if (invoice.getPatient() != null)
            dto.setPatientId(invoice.getPatient().getPatientId());

        if (invoice.getProvider() != null)
            dto.setProviderId(invoice.getProvider().getProviderId());

        return dto;
    }

    private Invoice mapToEntity(InvoiceDTO dto) {

        Invoice invoice = new Invoice();

        invoice.setInvoiceNumber(dto.getInvoiceNumber());
        invoice.setTotalAmount(dto.getTotalAmount());

        // ✅ ADD THESE
        invoice.setInvoiceDate(dto.getInvoiceDate());
        invoice.setDueDate(dto.getDueDate());
        invoice.setConsultationFee(dto.getConsultationFee());
        invoice.setDiagnosticTestFee(dto.getDiagnosticTestFee());
        invoice.setScanFee(dto.getScanFee());
        invoice.setMedicineFee(dto.getMedicineFee());
        invoice.setTax(dto.getTax());
        invoice.setStatus(dto.getStatus());

        // 🔥 connections
        Patient patient = patientRepo.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        HealthcareProvider provider = providerRepo.findById(dto.getProviderId())
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        invoice.setPatient(patient);
        invoice.setProvider(provider);

        return invoice;
    }
}