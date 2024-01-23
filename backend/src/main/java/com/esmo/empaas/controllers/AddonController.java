package com.esmo.empaas.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.esmo.empaas.dtos.AddonDto;
import com.esmo.empaas.entities.AddonEntity;
import com.esmo.empaas.services.AddonService;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/addons")
public class AddonController {

    private final AddonService addonService;
    private final ModelMapper mapper;

    public AddonController(AddonService addonService, ModelMapper mapper) {
        this.addonService = addonService;
        this.mapper = mapper;
    }

    @GetMapping()
    public ResponseEntity<List<AddonDto>> findAll() {
        return ResponseEntity
                .ok(addonService.findAll().stream().map(a -> mapper.map(a, AddonDto.class))
                        .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddonDto> findById(@PathVariable String id) {
        return ResponseEntity.ok(mapper.map(addonService.findById(id), AddonDto.class));
    }

    @GetMapping("/findByName/{name}")
    public ResponseEntity<AddonDto> findByName(@PathVariable String name) {
        return ResponseEntity.ok(mapper.map(addonService.findByName(name), AddonDto.class));
    }

    @PostMapping()
    public ResponseEntity<AddonDto> save(@RequestBody AddonDto data) {
        return ResponseEntity.ok(mapper.map(addonService.create(mapper.map(data, AddonEntity.class)), AddonDto.class));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddonDto> update(@PathVariable String id, @RequestBody AddonDto data) {
        return ResponseEntity
                .ok(mapper.map(addonService.update(id, mapper.map(data, AddonEntity.class)), AddonDto.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        addonService.delete(id);

        return ResponseEntity.ok().build();
    }
}
