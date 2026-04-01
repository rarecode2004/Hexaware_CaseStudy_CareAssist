package com.hexaware.careassist_claims.service;

import java.util.List;

import com.hexaware.careassist_claims.dto.HealthcareProviderDTO;

public interface IHealthcareProviderService {

    int addProvider(HealthcareProviderDTO providerDTO);

    List<HealthcareProviderDTO> getAllProviders();

    HealthcareProviderDTO getProviderById(int providerId);

    HealthcareProviderDTO getProviderByUserId(int userId);

    int updateProvider(HealthcareProviderDTO providerDTO);

    int deleteProvider(int providerId);
}