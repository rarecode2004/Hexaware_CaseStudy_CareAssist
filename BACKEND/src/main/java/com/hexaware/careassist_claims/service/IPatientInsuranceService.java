package com.hexaware.careassist_claims.service;

import java.util.Date;
import java.util.List;

import com.hexaware.careassist_claims.dto.PatientInsuranceDTO;

public interface IPatientInsuranceService {

    int assignPlanToPatient(PatientInsuranceDTO dto);

    PatientInsuranceDTO getById(int id);

    List<PatientInsuranceDTO> getByPatientId(int patientId);

    List<PatientInsuranceDTO> getAll();

    int renewPolicy(int id, Date newEndDate);

    int updateStatus(int id, String status);

    int deleteById(int id);
}