package com.esmo.empaas.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationEnvDto {

    private String id;
    private String key;
    private String value;
}
