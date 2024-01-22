package com.esmo.empaas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.esmo.empaas.entities.AddonVolumeEntity;

@Repository
public interface AddonVolumeRepository extends JpaRepository<AddonVolumeEntity, String>  {

}
