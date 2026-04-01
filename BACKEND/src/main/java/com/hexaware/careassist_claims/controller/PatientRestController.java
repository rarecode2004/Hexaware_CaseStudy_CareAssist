package com.hexaware.careassist_claims.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.hexaware.careassist_claims.dto.PatientDTO;
import com.hexaware.careassist_claims.service.IPatientService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/patients")
public class PatientRestController {

    @Autowired
    private IPatientService service;

    @PostMapping("/add")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public int addPatient(@Valid @RequestBody PatientDTO patientDTO) {
        return service.addPatient(patientDTO);
    }

    // ✅ Added HEALTHCARE_PROVIDER so providers can see patient list for invoice
    @GetMapping("/getall")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HEALTHCARE_PROVIDER')")
    public List<PatientDTO> getAllPatients() {
        return service.getAllPatients();
    }

    @GetMapping("/get/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PATIENT') or hasRole('HEALTHCARE_PROVIDER')")
    public PatientDTO getPatientById(@PathVariable int patientId) {
        return service.getPatientById(patientId);
    }

    @GetMapping("/get/user/{userId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public PatientDTO getPatientByUserId(@PathVariable int userId) {
        return service.getPatientByUserId(userId);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public int updatePatient(@Valid @RequestBody PatientDTO patientDTO) {
        return service.updatePatient(patientDTO);
    }

    @DeleteMapping("/delete/{patientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public int deletePatient(@PathVariable int patientId) {
        return service.deletePatient(patientId);
    }
}