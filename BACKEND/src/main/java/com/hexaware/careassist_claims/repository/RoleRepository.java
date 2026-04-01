package com.hexaware.careassist_claims.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.careassist_claims.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

}