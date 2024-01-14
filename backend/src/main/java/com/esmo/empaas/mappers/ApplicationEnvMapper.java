package com.esmo.empaas.mappers;

import com.esmo.empaas.dtos.ApplicationEnvDto;
import com.esmo.empaas.entities.ApplicationEnvEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApplicationEnvMapper {

    ApplicationEnvDto toDto(ApplicationEnvEntity entity);

    ApplicationEnvEntity toEntity(ApplicationEnvDto dto);
}
