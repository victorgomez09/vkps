package com.esmo.empaas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.esmo.empaas.entities.ApplicationEntity;

@Repository
public interface ApplicationRepository extends JpaRepository<ApplicationEntity, String> {

}
