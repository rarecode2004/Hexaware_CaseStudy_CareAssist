package com.hexaware.careassist_claims.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.careassist_claims.dto.PatientInsuranceDTO;
import com.hexaware.careassist_claims.service.IPatientInsuranceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/patient-insurance")
public class PatientInsuranceRestController {

    @Autowired
    private IPatientInsuranceService service;

    // Assign Plan to Patient
    @PostMapping("/add")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public int assignPlanToPatient(@Valid @RequestBody PatientInsuranceDTO dto) {
        return service.assignPlanToPatient(dto);
    }

    // Get Insurance By ID
    @GetMapping("/get/{id}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public PatientInsuranceDTO getById(@PathVariable int id) {
        return service.getById(id);
    }

    // Get Insurance By Patient ID
    @GetMapping("/get/patient/{patientId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public List<PatientInsuranceDTO> getByPatientId(@PathVariable int patientId) {
        return service.getByPatientId(patientId);
    }

    // Get All Patient Insurances
    @GetMapping("/getall")
    @PreAuthorize("hasRole('ADMIN')")
    public List<PatientInsuranceDTO> getAll() {
        return service.getAll();
    }

    // Renew Policy
    @PutMapping("/renew/{id}/{newEndDate}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public int renewPolicy(@PathVariable int id, @PathVariable Date newEndDate) {
        return service.renewPolicy(id, newEndDate);
    }

    // Update Status
    @PutMapping("/status/{id}/{status}")
    @PreAuthorize("hasRole('INSURANCE_COMPANY') or hasRole('ADMIN')")
    public int updateStatus(@PathVariable int id, @PathVariable String status) {
        return service.updateStatus(id, status);
    }

    // Delete Insurance
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public int deleteById(@PathVariable int id) {
        return service.deleteById(id);
    }
}