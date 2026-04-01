package com.hexaware.careassist_claims.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.careassist_claims.entity.ClaimDocument;

@Repository
public interface ClaimDocumentRepository extends JpaRepository<ClaimDocument, Integer> {

    List<ClaimDocument> findByClaim_ClaimId(int claimId);

}