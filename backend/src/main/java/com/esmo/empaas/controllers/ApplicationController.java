package com.esmo.empaas.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.esmo.empaas.dtos.ApplicationDto;
import com.esmo.empaas.mappers.ApplicationMapper;
import com.esmo.empaas.services.ApplicationService;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService service;
    private final ApplicationMapper mapper;

    @Autowired
    public ApplicationController(ApplicationService service, ApplicationMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping()
    public ResponseEntity<List<ApplicationDto>> findAll() {
        return ResponseEntity.ok(service.findAll().stream().map(mapper::toDto).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> findById(@PathVariable String id) {
        return ResponseEntity.ok(mapper.toDto(service.findById(id)));
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<String> findLogs(@PathVariable String id) {
        return ResponseEntity.ok(service.findLogs(id));
    }

    @PostMapping("/create")
    public ResponseEntity<ApplicationDto> create(@RequestBody ApplicationDto data) {
        return ResponseEntity.ok(mapper.toDto(service.create(mapper.toEntity(data))));
    }

    @PutMapping("/update")
    public ResponseEntity<ApplicationDto> update(@RequestParam String id, @RequestBody ApplicationDto data) {
        return ResponseEntity.ok(mapper.toDto(service.update(id, mapper.toEntity(data))));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(@RequestParam String id) {
        service.delete(id);

        return ResponseEntity.ok().build();
    }
}
