package com.hexaware.careassist_claims.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.careassist_claims.dto.InsuranceCompanyDTO;
import com.hexaware.careassist_claims.entity.InsuranceCompany;
import com.hexaware.careassist_claims.entity.User;
import com.hexaware.careassist_claims.repository.InsuranceCompanyRepository;
import com.hexaware.careassist_claims.repository.UserRepository;

@Service
@Transactional
public class InsuranceCompanyServiceImpl implements IInsuranceCompanyService {

    @Autowired
    private InsuranceCompanyRepository repo;

    @Autowired
    private UserRepository userRepo;

    // ================== ADD ==================
    @Override
    public int addCompany(InsuranceCompanyDTO dto) {

        InsuranceCompany company = mapToEntity(dto);

        repo.save(company);
        return 1;
    }

    // ================== GET ALL ==================
    @Override
    public List<InsuranceCompanyDTO> getAllCompanies() {

        return repo.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== GET BY ID ==================
    @Override
    public InsuranceCompanyDTO getCompanyById(int companyId) {

        InsuranceCompany company = repo.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        return mapToDTO(company);
    }

    // ================== GET BY USER ==================
    @Override
    public InsuranceCompanyDTO getCompanyByUserId(int userId) {

        InsuranceCompany company = repo.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        return mapToDTO(company);
    }

    // ================== UPDATE ==================
    @Override
    public int updateCompany(InsuranceCompanyDTO dto) {

        InsuranceCompany company = repo.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        company.setCompanyName(dto.getCompanyName());

        // 🔥 relationship
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        company.setUser(user);

        repo.save(company);
        return 1;
    }

    // ================== DELETE ==================
    @Override
    public int deleteCompany(int companyId) {

        if (!repo.existsById(companyId)) {
            throw new RuntimeException("Company not found");
        }

        repo.deleteById(companyId);
        return 1;
    }

    // ================== MAPPING ==================

    private InsuranceCompanyDTO mapToDTO(InsuranceCompany company) {

        InsuranceCompanyDTO dto = new InsuranceCompanyDTO();

        dto.setCompanyId(company.getCompanyId());
        dto.setCompanyName(company.getCompanyName());

        // ✅ ADD THESE
        dto.setAddress(company.getAddress());
        dto.setContactEmail(company.getContactEmail());
        dto.setContactPhone(company.getContactPhone());

        if (company.getUser() != null) {
            dto.setUserId(company.getUser().getUserId());
        }

        return dto;
    }

    private InsuranceCompany mapToEntity(InsuranceCompanyDTO dto) {

        InsuranceCompany company = new InsuranceCompany();

        company.setCompanyName(dto.getCompanyName());

        // ✅ ADD THESE
        company.setAddress(dto.getAddress());
        company.setContactEmail(dto.getContactEmail());
        company.setContactPhone(dto.getContactPhone());

        // 🔥 relationship
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        company.setUser(user);

        return company;
    }
}