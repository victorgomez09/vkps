package com.esmo.empaas.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AddonVolumeDto {

	private String id;
	private String path;
	private int size;
	private String accessMode;
}
