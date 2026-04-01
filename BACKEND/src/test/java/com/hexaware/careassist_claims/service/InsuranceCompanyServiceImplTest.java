package com.hexaware.careassist_claims.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.careassist_claims.dto.InsuranceCompanyDTO;
import com.hexaware.careassist_claims.dto.UserDTO;

@SpringBootTest
class InsuranceCompanyServiceImplTest {

    @Autowired
    private IInsuranceCompanyService service;

    @Autowired
    private IUserService userService;

    @Test
    void testAddCompany() {

        UserDTO user = userService.getUserById(1);

        InsuranceCompanyDTO company = new InsuranceCompanyDTO();
        company.setUserId(user.getUserId());
        company.setCompanyName("Star Health");
        company.setAddress("Hyderabad");
        company.setContactEmail("star@gmail.com");
        company.setContactPhone("9876543210");

        int result = service.addCompany(company);

        assertEquals(1, result);
    }

    @Test
    void testGetAllCompanies() {

        List<InsuranceCompanyDTO> list = service.getAllCompanies();

        assertNotNull(list);
    }

    @Test
    void testGetCompanyById() {

        InsuranceCompanyDTO company = service.getCompanyById(1);

        assertNotNull(company);
    }

    @Test
    void testGetCompanyByUserId() {

        InsuranceCompanyDTO company = service.getCompanyByUserId(1);

        assertNotNull(company);
    }

    @Test
    void testUpdateCompany() {

        InsuranceCompanyDTO company = service.getCompanyById(1);

        company.setAddress("Updated Address");

        int result = service.updateCompany(company);

        assertEquals(1, result);
    }

    @Test
    void testDeleteCompany() {

        int result = service.deleteCompany(1);

        assertEquals(1, result);
    }
}