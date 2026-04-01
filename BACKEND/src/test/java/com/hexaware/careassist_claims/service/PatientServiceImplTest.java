package com.hexaware.careassist_claims.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.careassist_claims.dto.PatientDTO;
import com.hexaware.careassist_claims.dto.UserDTO;

@SpringBootTest
class PatientServiceImplTest {

    @Autowired
    private IPatientService service;

    @Autowired
    private IUserService userService;

    @Test
    void testAddPatient() {

        UserDTO user = userService.getUserById(1);

        PatientDTO patient = new PatientDTO();
        patient.setFullName("Hii");
        patient.setMobile("9876543210");
        patient.setUserId(user.getUserId());

        int result = service.addPatient(patient);

        assertEquals(1, result);
    }

    @Test
    void testGetAllPatients() {

        List<PatientDTO> list = service.getAllPatients();

        assertNotNull(list);
        assertTrue(list.size() >= 0);
    }

    @Test
    void testGetPatientById() {

        PatientDTO patient = service.getPatientById(1);

        assertNotNull(patient);
    }

    @Test
    void testUpdatePatient() {

        PatientDTO patient = service.getPatientById(1);

        patient.setMobile("9998889997776");

        int result = service.updatePatient(patient);

        assertEquals(1, result);
    }

    @Test
    void testDeletePatient() {

        int pid = 2;

        int result = service.deletePatient(pid);

        assertEquals(1, result);
    }
}