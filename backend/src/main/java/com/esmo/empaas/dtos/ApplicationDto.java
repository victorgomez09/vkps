package com.esmo.empaas.dtos;

import java.sql.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ApplicationDto {

	private String id;
	private String name;
	private String description;
	private String repositoryUrl;
	private String dockerImage;
	private String cpu;
	private String memory;
	private Integer port;
	private Boolean isBot;
	private String addonVersion;
	private String addonName;
	private Integer replicas;
	private List<ApplicationEnvDto> envs;
	private List<ApplicationVolumeDto> volumes;
	private Date creationDate;
	private Date modificationDate;
}
