package com.hexaware.careassist_claims.controller;

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

import com.hexaware.careassist_claims.dto.HealthcareProviderDTO;
import com.hexaware.careassist_claims.service.IHealthcareProviderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/healthcare-providers")
public class HealthcareProviderRestController {

    @Autowired
    private IHealthcareProviderService service;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HEALTHCARE_PROVIDER')")
    public int addProvider(@Valid @RequestBody HealthcareProviderDTO providerDTO) {
        return service.addProvider(providerDTO);
    }

    @GetMapping("/getall")
    @PreAuthorize("hasRole('ADMIN')")
    public List<HealthcareProviderDTO> getAllProviders() {
        return service.getAllProviders();
    }

    @GetMapping("/get/{providerId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HEALTHCARE_PROVIDER')")
    public HealthcareProviderDTO getProviderById(@PathVariable int providerId) {
        return service.getProviderById(providerId);
    }

    @GetMapping("/get/user/{userId}")
    @PreAuthorize("hasRole('HEALTHCARE_PROVIDER') or hasRole('ADMIN')")
    public HealthcareProviderDTO getProviderByUserId(@PathVariable int userId) {
        return service.getProviderByUserId(userId);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('HEALTHCARE_PROVIDER') or hasRole('ADMIN')")
    public int updateProvider(@Valid @RequestBody HealthcareProviderDTO providerDTO) {
        return service.updateProvider(providerDTO);
    }

    @DeleteMapping("/delete/{providerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public int deleteProvider(@PathVariable int providerId) {
        return service.deleteProvider(providerId);
    }
}