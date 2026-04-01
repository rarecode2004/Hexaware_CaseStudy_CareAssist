package com.hexaware.careassist_claims.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.careassist_claims.dto.PatientInsuranceDTO;

@SpringBootTest
class PatientInsuranceServiceImplTest {

    @Autowired
    private IPatientInsuranceService service;

    @Test
    void testAssignPlanToPatient() {

        PatientInsuranceDTO pi = new PatientInsuranceDTO();
        pi.setPatientId(1);   // existing patient
        pi.setPlanId(1);      // existing plan
        pi.setPolicyNumber("POL-101");
        pi.setStartDate(new Date());
        pi.setEndDate(new Date(System.currentTimeMillis() + 31536000000L));
        pi.setStatus("Active");

        int result = service.assignPlanToPatient(pi);

        assertEquals(1, result);
    }

    @Test
    void testGetById() {

        PatientInsuranceDTO pi = service.getById(1);

        assertNotNull(pi);
    }

    @Test
    void testGetByPatientId() {

        List<PatientInsuranceDTO> list = service.getByPatientId(1);

        assertNotNull(list);
    }

    @Test
    void testGetAll() {

        List<PatientInsuranceDTO> list = service.getAll();

        assertNotNull(list);
        assertTrue(list.size() >= 0);
    }

    @Test
    void testRenewPolicy() {

        Date newEndDate = new Date(System.currentTimeMillis() + 2 * 31536000000L);

        int result = service.renewPolicy(1, newEndDate);

        assertEquals(1, result);
    }

    @Test
    void testUpdateStatus() {

        int result = service.updateStatus(1, "Expired");

        assertEquals(1, result);
    }

    @Test
    void testDeleteById() {

        int result = service.deleteById(1);

        assertEquals(1, result);
    }
}