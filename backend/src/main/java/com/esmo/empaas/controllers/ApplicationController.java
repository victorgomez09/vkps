package com.esmo.empaas.controllers;

import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.esmo.empaas.dtos.ApplicationDto;
import com.esmo.empaas.entities.ApplicationEntity;
import com.esmo.empaas.services.ApplicationService;

import io.kubernetes.client.openapi.models.V1Deployment;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

	private final ApplicationService service;
	private final ModelMapper mapper;

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
	public ResponseEntity<Map<String, String>> findLogs(@PathVariable String id) {
		return ResponseEntity.ok(service.findLogs(id));
	}

	@PostMapping("/{id}/deploy")
	public ResponseEntity<V1Deployment> deploy(@PathVariable String id) {
		return ResponseEntity.ok(service.deploy(id));

//		return ResponseEntity.ok("Application deployed");
	}

	@PostMapping()
	public ResponseEntity<ApplicationDto> create(@RequestBody ApplicationDto data) {
		return ResponseEntity
				.ok(mapper.map(service.create(mapper.map(data, ApplicationEntity.class)), ApplicationDto.class));
	}

	@PutMapping("/update")
	public ResponseEntity<ApplicationDto> update(@RequestParam String id, @RequestBody ApplicationDto data) {
		return ResponseEntity
				.ok(mapper.map(service.update(id, mapper.map(data, ApplicationEntity.class)), ApplicationDto.class));
	}

	@DeleteMapping("/delete")
	public ResponseEntity<Void> delete(@RequestParam String id) {
		service.delete(id);

		return ResponseEntity.ok().build();
	}
}
