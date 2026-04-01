package com.hexaware.careassist_claims.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.careassist_claims.dto.PatientDTO;
import com.hexaware.careassist_claims.entity.Patient;
import com.hexaware.careassist_claims.entity.User;
import com.hexaware.careassist_claims.repository.PatientRepository;
import com.hexaware.careassist_claims.repository.UserRepository;

@Service
@Transactional
public class PatientServiceImpl implements IPatientService {

    @Autowired
    private PatientRepository repo;

    @Autowired
    private UserRepository userRepo;

    // ================== ADD ==================
    @Override
    public int addPatient(PatientDTO dto) {

        Patient patient = mapToEntity(dto);

        repo.save(patient);
        return 1;
    }

    // ================== GET ALL ==================
    @Override
    public List<PatientDTO> getAllPatients() {

        return repo.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== GET BY ID ==================
    @Override
    public PatientDTO getPatientById(int patientId) {

        Patient patient = repo.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return mapToDTO(patient);
    }
    
    
    
    @Override
    public PatientDTO getPatientByUserId(int userId) {

        Patient patient = repo.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return mapToDTO(patient);
    }
    

    // ================== UPDATE ==================
    @Override
    public int updatePatient(PatientDTO dto) {

        Patient patient = repo.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        patient.setFullName(dto.getFullName());
        patient.setAge(dto.getAge());
        patient.setGender(dto.getGender());
        patient.setMobile(dto.getMobile());
        patient.setAddress(dto.getAddress());

        // 🔥 relationship
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        patient.setUser(user);

        repo.save(patient);
        return 1;
    }

    // ================== DELETE ==================
    @Override
    public int deletePatient(int patientId) {

        if (!repo.existsById(patientId)) {
            throw new RuntimeException("Patient not found");
        }

        repo.deleteById(patientId);
        return 1;
    }

    // ================== MAPPING ==================

    private PatientDTO mapToDTO(Patient patient) {

        PatientDTO dto = new PatientDTO();

        dto.setPatientId(patient.getPatientId());
        dto.setFullName(patient.getFullName());
        dto.setAge(patient.getAge());
        dto.setGender(patient.getGender());

        dto.setAddress(patient.getAddress());
        dto.setMobile(patient.getMobile());

        if (patient.getUser() != null) {
            dto.setUserId(patient.getUser().getUserId());
        }

        return dto;
    }

    private Patient mapToEntity(PatientDTO dto) {

        Patient patient = new Patient();

        patient.setFullName(dto.getFullName());
        patient.setAge(dto.getAge());
        patient.setGender(dto.getGender());

   
        patient.setAddress(dto.getAddress());
        patient.setMobile(dto.getMobile());

        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        patient.setUser(user);

        return patient;
    }
}