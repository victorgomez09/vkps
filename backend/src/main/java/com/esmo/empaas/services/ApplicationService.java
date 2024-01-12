package com.esmo.empaas.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.esmo.empaas.entities.ApplicationEntity;
import com.esmo.empaas.exceptions.ResourceAlreadyExistsException;
import com.esmo.empaas.exceptions.ResourceNotFoundException;
import com.esmo.empaas.repositories.ApplicationRepository;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository repository;

    public List<ApplicationEntity> findAll() {
        return repository.findAll();
    }

    public ApplicationEntity findById(String id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));
    }

    public ApplicationEntity create(ApplicationEntity data) {
        if (repository.findById(data.getId()).isPresent()) {
            throw new ResourceAlreadyExistsException("Application", "id", data.getId());
        }

        return repository.save(data);
    }
}
