package com.esmo.empaas.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationVolumeDto {

    private String id;
    private String path;
    private int size;
    private String accessMode;
}
