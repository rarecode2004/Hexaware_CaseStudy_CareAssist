package com.hexaware.careassist_claims.service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.careassist_claims.dto.PatientInsuranceDTO;
import com.hexaware.careassist_claims.entity.InsurancePlan;
import com.hexaware.careassist_claims.entity.Patient;
import com.hexaware.careassist_claims.entity.PatientInsurance;
import com.hexaware.careassist_claims.repository.InsurancePlanRepository;
import com.hexaware.careassist_claims.repository.PatientInsuranceRepository;
import com.hexaware.careassist_claims.repository.PatientRepository;

@Service
@Transactional
public class PatientInsuranceServiceImpl implements IPatientInsuranceService {

    @Autowired
    private PatientInsuranceRepository repo;

    @Autowired
    private PatientRepository patientRepo;

    @Autowired
    private InsurancePlanRepository planRepo;

    // ================== ASSIGN ==================
    @Override
    public int assignPlanToPatient(PatientInsuranceDTO dto) {

        PatientInsurance insurance = mapToEntity(dto);

        repo.save(insurance);
        return 1;
    }

    // ================== GET BY ID ==================
    @Override
    public PatientInsuranceDTO getById(int id) {

        PatientInsurance insurance = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Insurance not found"));

        return mapToDTO(insurance);
    }

    // ================== GET BY PATIENT ==================
    @Override
    public List<PatientInsuranceDTO> getByPatientId(int patientId) {

        return repo.findByPatient_PatientId(patientId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== GET ALL ==================
    @Override
    public List<PatientInsuranceDTO> getAll() {

        return repo.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== RENEW ==================
    @Override
    public int renewPolicy(int id, Date newEndDate) {

        PatientInsurance insurance = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Insurance not found"));

        insurance.setEndDate(newEndDate);

        repo.save(insurance);
        return 1;
    }

    // ================== UPDATE STATUS ==================
    @Override
    public int updateStatus(int id, String status) {
    	if (!status.matches("ACTIVE|EXPIRED|CANCELLED")) {
            throw new RuntimeException("Invalid status!, should be only ACTIVE|EXPIRED|CANCELLED");
        }

        PatientInsurance insurance = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Insurance not found"));

        insurance.setStatus(status);

        repo.save(insurance);
        return 1;
    }

    // ================== DELETE ==================
    @Override
    public int deleteById(int id) {

        if (!repo.existsById(id)) {
            throw new RuntimeException("Insurance not found");
        }

        repo.deleteById(id);
        return 1;
    }

    // ================== MAPPING ==================

    private PatientInsuranceDTO mapToDTO(PatientInsurance insurance) {

        PatientInsuranceDTO dto = new PatientInsuranceDTO();

        dto.setId(insurance.getId());
        dto.setPolicyNumber(insurance.getPolicyNumber()); // ✅ ADD
        dto.setStartDate(insurance.getStartDate());
        dto.setEndDate(insurance.getEndDate());
        dto.setStatus(insurance.getStatus());

        if (insurance.getPatient() != null)
            dto.setPatientId(insurance.getPatient().getPatientId());

        if (insurance.getPlan() != null)
            dto.setPlanId(insurance.getPlan().getPlanId());

        return dto;
    }

    private PatientInsurance mapToEntity(PatientInsuranceDTO dto) {

        PatientInsurance insurance = new PatientInsurance();

        insurance.setPolicyNumber(dto.getPolicyNumber()); // ✅ ADD
        insurance.setStartDate(dto.getStartDate());
        insurance.setEndDate(dto.getEndDate());
        insurance.setStatus(dto.getStatus());

        // 🔥 relationships
        Patient patient = patientRepo.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        InsurancePlan plan = planRepo.findById(dto.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        insurance.setPatient(patient);
        insurance.setPlan(plan);

        return insurance;
    }
}