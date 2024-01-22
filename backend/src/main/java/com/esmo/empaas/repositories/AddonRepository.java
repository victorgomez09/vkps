package com.esmo.empaas.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.esmo.empaas.entities.AddonEntity;

public interface AddonRepository extends JpaRepository<AddonEntity, String> {
    Optional<AddonEntity> findByName(String name);
}
