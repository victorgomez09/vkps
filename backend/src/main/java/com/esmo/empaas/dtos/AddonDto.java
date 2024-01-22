package com.esmo.empaas.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AddonDto {

    private String id;
    private String name;
    private String fancyName;
    private String image;
    private String description;
    private String logo;
    private int port;
    private List<AddonVersionDto> versions;
    private List<AddonEnvDto> envs;
    private List<AddonVolumeDto> volumes;
}
