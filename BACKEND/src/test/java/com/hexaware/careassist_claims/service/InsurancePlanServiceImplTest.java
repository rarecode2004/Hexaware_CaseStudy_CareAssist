package com.hexaware.careassist_claims.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.careassist_claims.dto.InsuranceCompanyDTO;
import com.hexaware.careassist_claims.dto.InsurancePlanDTO;
import com.hexaware.careassist_claims.dto.UserDTO;

@SpringBootTest
class InsurancePlanServiceImplTest {

    @Autowired
    private IInsurancePlanService service;

    @Autowired
    private IInsuranceCompanyService companyService;

    @Autowired
    private IUserService userService;

    @Test
    void testAddPlan() {

        UserDTO user = userService.getUserById(1);

        InsuranceCompanyDTO company = new InsuranceCompanyDTO();
        company.setUserId(user.getUserId());
        company.setCompanyName("Test Company");
        company.setAddress("Chennai");
        company.setContactEmail("test@mail.com");
        company.setContactPhone("9999999999");

        companyService.addCompany(company);

        InsuranceCompanyDTO savedCompany =
                companyService.getAllCompanies().get(0);

        InsurancePlanDTO plan = new InsurancePlanDTO();
        plan.setCompanyId(savedCompany.getCompanyId());
        plan.setPlanName("Premium Plan");
        plan.setMaxCoverageAmount(500000);
        plan.setPremiumAmount(15000);

        int result = service.addPlan(plan);

        assertEquals(1, result);
    }

    @Test
    void testGetAllPlans() {

        List<InsurancePlanDTO> list = service.getAllPlans();

        assertNotNull(list);
    }

    @Test
    void testGetPlanById() {

        InsurancePlanDTO plan = service.getPlanById(1);

        assertNotNull(plan);
    }

    @Test
    void testGetPlansByCompanyId() {

        List<InsurancePlanDTO> plans = service.getPlansByCompanyId(1);

        assertNotNull(plans);
    }

    @Test
    void testUpdatePlan() {

        InsurancePlanDTO plan = service.getPlanById(1);

        plan.setPremiumAmount(20000);

        int result = service.updatePlan(plan);

        assertEquals(1, result);
    }

    @Test
    void testDeletePlan() {

        int result = service.deletePlan(1);

        assertEquals(1, result);
    }
}