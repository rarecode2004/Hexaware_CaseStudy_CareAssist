package com.hexaware.careassist_claims.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.hexaware.careassist_claims.dto.ClaimDTO;
import com.hexaware.careassist_claims.entity.Claim;
import com.hexaware.careassist_claims.entity.ClaimDocument;
import com.hexaware.careassist_claims.entity.InsuranceCompany;
import com.hexaware.careassist_claims.entity.Invoice;
import com.hexaware.careassist_claims.entity.Patient;
import com.hexaware.careassist_claims.repository.ClaimDocumentRepository;
import com.hexaware.careassist_claims.repository.ClaimRepository;
import com.hexaware.careassist_claims.repository.InsuranceCompanyRepository;
import com.hexaware.careassist_claims.repository.InvoiceRepository;
import com.hexaware.careassist_claims.repository.PatientRepository;
import com.hexaware.careassist_claims.service.notification.EmailService;

@Service
@Transactional
public class ClaimServiceImpl implements IClaimService {

    @Autowired
    private ClaimRepository repo;
    
    @Autowired
    private ClaimDocumentRepository docRepo;

    @Autowired
    private PatientRepository patientRepo;

    @Autowired
    private InvoiceRepository invoiceRepo;

    @Autowired
    private InsuranceCompanyRepository companyRepo;
    
    @Autowired
    private EmailService emailService;

    // ================== ADD CLAIM ==================
    @Override
    public int addClaim(ClaimDTO dto) {

        Claim claim = mapToEntity(dto);

        repo.save(claim);

        // 🔥 EMAIL: CLAIM SUBMITTED
        String email = claim.getPatient().getUser().getEmail();
        emailService.sendClaimSubmittedEmail(email);

        return 1;
    }

    
    
    @Override
    public void addClaimWithDocuments(int patientId, int invoiceId, int companyId,
                                     String diagnosis, String treatmentDetails,
                                     double claimAmount, List<MultipartFile> files) {

        Claim claim = new Claim();

        claim.setClaimNumber("CLM" + System.currentTimeMillis());
        claim.setClaimStatus("PENDING");
        claim.setDiagnosis(diagnosis);
        claim.setTreatmentDetails(treatmentDetails);
        claim.setClaimAmount(claimAmount);

        Patient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Invoice invoice = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        InsuranceCompany company = companyRepo.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        claim.setPatient(patient);
        claim.setInvoice(invoice);
        claim.setInsuranceCompany(company);

        repo.save(claim);

        // 🔥 FILE SAVE
        String uploadDir = "uploads/documents/";

        for (MultipartFile file : files) {
            try {
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

                Path path = Paths.get(uploadDir + fileName);
                Files.createDirectories(path.getParent());
                Files.write(path, file.getBytes());

                ClaimDocument doc = new ClaimDocument();
                doc.setFileName(fileName);
                doc.setFilePath("/uploads/documents/" + fileName);
                doc.setClaim(claim);

                docRepo.save(doc);

            } catch (Exception e) {
                throw new RuntimeException("File upload failed");
            }
        }

        emailService.sendClaimSubmittedEmail(patient.getUser().getEmail());
    }
    
    
    
    // ================== GET ALL ==================
    @Override
    public List<ClaimDTO> getAllClaims() {

        return repo.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== GET BY ID ==================
    @Override
    public ClaimDTO getClaimById(int claimId) {

        Claim claim = repo.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        return mapToDTO(claim);
    }

    // ================== GET BY NUMBER ==================
    @Override
    public ClaimDTO getClaimByNumber(String claimNumber) {

        Claim claim = repo.findByClaimNumber(claimNumber)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        return mapToDTO(claim);
    }

    // ================== GET BY PATIENT ==================
    @Override
    public List<ClaimDTO> getClaimsByPatientId(int patientId) {

        List<Claim> claims = repo.findByPatient_PatientId(patientId);

        if (claims.isEmpty()) {
            return List.of();  // ✅ return empty list instead of null
        }

        return claims.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== UPDATE STATUS ==================
    @Override
    public int updateClaimStatus(int claimId, String status) {
    	if (!status.matches("PENDING|APPROVED|REJECTED")) {
            throw new RuntimeException("Invalid status!, should be only PENDING|APPROVED|REJECTED");
        }

        Claim claim = repo.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claim.setClaimStatus(status);
        
        repo.save(claim);

        // 🔥 EMAIL: APPROVED / REJECTED
        String email = claim.getPatient().getUser().getEmail();
        emailService.sendClaimStatusEmail(email, status);

        return 1;
    }

    // ================== DELETE ==================
    @Override
    public int deleteClaim(int claimId) {

        if (!repo.existsById(claimId)) {
            throw new RuntimeException("Claim not found");
        }

        repo.deleteById(claimId);
        return 1;
    }

    // ================== MAPPING ==================

    private ClaimDTO mapToDTO(Claim claim) {

        ClaimDTO dto = new ClaimDTO();

        dto.setClaimId(claim.getClaimId());
        dto.setClaimNumber(claim.getClaimNumber());
        dto.setClaimStatus(claim.getClaimStatus());

        dto.setDiagnosis(claim.getDiagnosis());
        dto.setTreatmentDetails(claim.getTreatmentDetails());
        dto.setClaimAmount(claim.getClaimAmount());

        if (claim.getPatient() != null)
            dto.setPatientId(claim.getPatient().getPatientId());

        if (claim.getInvoice() != null)
            dto.setInvoiceId(claim.getInvoice().getInvoiceId());

        if (claim.getInsuranceCompany() != null)
            dto.setCompanyId(claim.getInsuranceCompany().getCompanyId());

        return dto;
    }

    private Claim mapToEntity(ClaimDTO dto) {

        Claim claim = new Claim();

        claim.setClaimNumber(dto.getClaimNumber());
        claim.setClaimStatus(dto.getClaimStatus());

        claim.setDiagnosis(dto.getDiagnosis());
        claim.setTreatmentDetails(dto.getTreatmentDetails());
        claim.setClaimAmount(dto.getClaimAmount());

        //  connections
        Patient patient = patientRepo.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Invoice invoice = invoiceRepo.findById(dto.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        InsuranceCompany company = companyRepo.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        claim.setPatient(patient);
        claim.setInvoice(invoice);
        claim.setInsuranceCompany(company);

        return claim;
    }
}