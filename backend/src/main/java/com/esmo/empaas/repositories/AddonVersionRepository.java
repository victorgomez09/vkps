package com.esmo.empaas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.esmo.empaas.entities.AddonVersionEntity;

@Repository
public interface AddonVersionRepository extends JpaRepository<AddonVersionEntity, String> {

}
