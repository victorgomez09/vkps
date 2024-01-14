package com.esmo.empaas.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import com.esmo.empaas.dtos.ApplicationVolumeDto;
import com.esmo.empaas.entities.ApplicationVolumeEntity;

@Mapper(componentModel = "spring")
public interface ApplicationVolumeMapper {

    ApplicationVolumeDto toDto(ApplicationVolumeEntity entity);

    ApplicationVolumeEntity toEntity(ApplicationVolumeDto dto);
}
