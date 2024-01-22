package com.esmo.empaas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.esmo.empaas.entities.AddonEnvEntity;

@Repository
public interface AddonEnvRepository extends JpaRepository<AddonEnvEntity, String> {

}
