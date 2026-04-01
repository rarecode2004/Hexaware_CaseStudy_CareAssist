package com.hexaware.careassist_claims.service;

import java.util.List;

import com.hexaware.careassist_claims.dto.InsuranceCompanyDTO;

public interface IInsuranceCompanyService {

    int addCompany(InsuranceCompanyDTO companyDTO);

    List<InsuranceCompanyDTO> getAllCompanies();

    InsuranceCompanyDTO getCompanyById(int companyId);

    InsuranceCompanyDTO getCompanyByUserId(int userId);

    int updateCompany(InsuranceCompanyDTO companyDTO);

    int deleteCompany(int companyId);
}