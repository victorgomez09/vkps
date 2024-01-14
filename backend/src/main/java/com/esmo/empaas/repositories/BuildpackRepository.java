package com.esmo.empaas.repositories;

import com.esmo.empaas.entities.BuildpackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuildpackRepository extends JpaRepository<BuildpackEntity, String> {
    Optional<BuildpackEntity> findByName(String name);
}
