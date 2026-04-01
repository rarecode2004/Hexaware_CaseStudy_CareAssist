package com.hexaware.careassist_claims.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.careassist_claims.dto.HealthcareProviderDTO;
import com.hexaware.careassist_claims.entity.HealthcareProvider;
import com.hexaware.careassist_claims.entity.User;
import com.hexaware.careassist_claims.repository.HealthcareProviderRepository;
import com.hexaware.careassist_claims.repository.UserRepository;

@Service
@Transactional
public class HealthcareProviderServiceImpl implements IHealthcareProviderService {

    @Autowired
    private HealthcareProviderRepository repo;

    @Autowired
    private UserRepository userRepo;

    // ================== ADD ==================
    @Override
    public int addProvider(HealthcareProviderDTO dto) {

        HealthcareProvider provider = mapToEntity(dto);

        repo.save(provider);
        return 1;
    }

    // ================== GET ALL ==================
    @Override
    public List<HealthcareProviderDTO> getAllProviders() {

        return repo.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== GET BY ID ==================
    @Override
    public HealthcareProviderDTO getProviderById(int providerId) {

        HealthcareProvider provider = repo.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        return mapToDTO(provider);
    }

    // ================== GET BY USER ==================
    @Override
    public HealthcareProviderDTO getProviderByUserId(int userId) {

        HealthcareProvider provider = repo.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        return mapToDTO(provider);
    }

    // ================== UPDATE ==================
    @Override
    public int updateProvider(HealthcareProviderDTO dto) {

        HealthcareProvider provider = repo.findById(dto.getProviderId())
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        // ✅ Update all fields
        provider.setProviderName(dto.getProviderName());
        provider.setAddress(dto.getAddress());
        provider.setContactNumber(dto.getContactNumber());

        // 🔥 User connection
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        provider.setUser(user);

        repo.save(provider);
        return 1;
    }

    // ================== DELETE ==================
    @Override
    public int deleteProvider(int providerId) {

        if (!repo.existsById(providerId)) {
            throw new RuntimeException("Provider not found");
        }

        repo.deleteById(providerId);
        return 1;
    }

    // ================== MAPPING ==================

    private HealthcareProviderDTO mapToDTO(HealthcareProvider provider) {

        HealthcareProviderDTO dto = new HealthcareProviderDTO();

        dto.setProviderId(provider.getProviderId());
        dto.setProviderName(provider.getProviderName());

        // ✅ ADD THESE
        dto.setAddress(provider.getAddress());
        dto.setContactNumber(provider.getContactNumber());

        if (provider.getUser() != null) {
            dto.setUserId(provider.getUser().getUserId());
        }

        return dto;
    }
    private HealthcareProvider mapToEntity(HealthcareProviderDTO dto) {

        HealthcareProvider provider = new HealthcareProvider();

        provider.setProviderName(dto.getProviderName());

        provider.setAddress(dto.getAddress());
        provider.setContactNumber(dto.getContactNumber());

        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        provider.setUser(user);

        return provider;
    }
}