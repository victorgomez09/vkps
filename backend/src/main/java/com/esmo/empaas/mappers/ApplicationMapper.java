package com.esmo.empaas.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.esmo.empaas.dtos.ApplicationDto;
import com.esmo.empaas.entities.ApplicationEntity;

@Mapper(componentModel = "spring", uses = { ApplicationEnvMapper.class, ApplicationVolumeMapper.class })
public interface ApplicationMapper {

    ApplicationDto toDto(ApplicationEntity entity);

    ApplicationEntity toEntity(ApplicationDto dto);
}
