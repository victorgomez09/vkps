package com.esmo.empaas.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esmo.empaas.entities.AddonEntity;
import com.esmo.empaas.exceptions.ResourceAlreadyExistsException;
import com.esmo.empaas.exceptions.ResourceNotFoundException;
import com.esmo.empaas.repositories.AddonRepository;

@Service
public class AddonService {

    private final AddonRepository addonRepository;

    public AddonService(AddonRepository addonRepository) {
        this.addonRepository = addonRepository;
    }

    public List<AddonEntity> findAll() {
        return addonRepository.findAll();
    }

    public AddonEntity findbyId(String id) {
        return addonRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Addon", "id", id));
    }

    public AddonEntity create(AddonEntity data) {
        if (addonRepository.findByName(data.getName()).isPresent()) {
            throw new ResourceAlreadyExistsException("Addon", "name", data.getName());
        }

        return addonRepository.save(data);
    }

    public AddonEntity update(String id, AddonEntity data) {
        AddonEntity addon = addonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Addon", "name", id));

        addon.setName(data.getName());
        addon.setDescription(data.getDescription());
        addon.setImage(data.getImage());
        addon.setInfoUrl(data.getInfoUrl());
        addon.setLogo(data.getLogo());
        addon.setPort(data.getPort());
        addon.setVersions(data.getVersions());
        addon.setEnvs(data.getEnvs());
        addon.setVolumes(data.getVolumes());

        return addonRepository.save(addon);
    }

    public void delete(String id) {
        AddonEntity addon = addonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Addon", "name", id));

        addonRepository.delete(addon);
    }
}
