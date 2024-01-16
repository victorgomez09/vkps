package com.esmo.empaas.controllers;

import java.util.List;

import com.esmo.empaas.entities.ApplicationEntity;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.esmo.empaas.dtos.ApplicationDto;
import com.esmo.empaas.services.ApplicationService;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService service;
    private final ModelMapper mapper;

    @Autowired
    public ApplicationController(ApplicationService service, ModelMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping()
    public ResponseEntity<List<ApplicationDto>> findAll() {
        return ResponseEntity.ok(service.findAll().stream().map(e -> mapper.map(e, ApplicationDto.class)).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> findById(@PathVariable String id) {
        return ResponseEntity.ok(mapper.map(service.findById(id), ApplicationDto.class));
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<String> findLogs(@PathVariable String id) {
        return ResponseEntity.ok(service.findLogs(id));
    }

    @PostMapping("/{id}/deploy")
    public ResponseEntity<String> deploy(@PathVariable String id) {
        service.deploy(id);

        return ResponseEntity.ok("Application dep\nloyed");
    }

    @PostMapping("/create")
    public ResponseEntity<ApplicationDto> create(@RequestBody ApplicationDto data) {
        return ResponseEntity.ok(mapper.map(service.create(mapper.map(data, ApplicationEntity.class)), ApplicationDto.class));
    }

    @PutMapping("/update")
    public ResponseEntity<ApplicationDto> update(@RequestParam String id, @RequestBody ApplicationDto data) {
        return ResponseEntity.ok(mapper.map(service.update(id, mapper.map(data, ApplicationEntity.class)), ApplicationDto.class));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(@RequestParam String id) {
        service.delete(id);

        return ResponseEntity.ok().build();
    }
}
