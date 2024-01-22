package com.esmo.empaas.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AddonEnvDto {

    private String id;
    private String key;
    private String value;
    private boolean optional;
}
