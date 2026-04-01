package com.hexaware.careassist_claims.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.careassist_claims.dto.HealthcareProviderDTO;

@SpringBootTest
class HealthcareProviderServiceImplTest {

    @Autowired
    private IHealthcareProviderService service;

    @Test
    void testAddProvider() {

        HealthcareProviderDTO provider = new HealthcareProviderDTO();
        provider.setProviderName("Apollo Hospital");
        provider.setAddress("Chennai");

        int result = service.addProvider(provider);

        assertEquals(1, result);
    }

    @Test
    void testGetAllProviders() {

        List<HealthcareProviderDTO> list = service.getAllProviders();

        assertNotNull(list);
    }

    @Test
    void testGetProviderById() {

        HealthcareProviderDTO provider = service.getProviderById(1);

        assertNotNull(provider);
    }

    @Test
    void testGetProviderByUserId() {

        HealthcareProviderDTO provider = service.getProviderByUserId(1);

        assertNotNull(provider);
    }

    @Test
    void testUpdateProvider() {

        HealthcareProviderDTO provider = service.getProviderById(1);

        provider.setAddress("Updated Address");

        int result = service.updateProvider(provider);

        assertEquals(1, result);
    }

    @Test
    void testDeleteProvider() {

        int result = service.deleteProvider(1);

        assertEquals(1, result);
    }
}