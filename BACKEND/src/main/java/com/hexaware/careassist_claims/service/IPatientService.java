package com.hexaware.careassist_claims.service;

import java.util.List;

import com.hexaware.careassist_claims.dto.PatientDTO;
public interface IPatientService {

    int addPatient(PatientDTO dto);

    List<PatientDTO> getAllPatients();

    PatientDTO getPatientById(int patientId);
    
    PatientDTO getPatientByUserId(int userId);

    int updatePatient(PatientDTO dto);

    int deletePatient(int patientId);
}