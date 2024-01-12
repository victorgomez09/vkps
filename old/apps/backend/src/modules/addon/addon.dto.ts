import { IsArray, IsDate, IsObject, IsString } from 'class-validator';

import { AddonEnvDto, AddonEnvRequestDto } from '../addon-env/addon-env.dto';
import {
  AddonVersionDto,
  AddonVersionRequestDto,
} from '../addon-version/addon-version.dto';
import {
  AddonVolumeDto,
  AddonVolumeRequestDto,
} from '../addon-volume/addon-volume.dto';

import { Addon } from './addon.entity';

export class AddonDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  logo: string;

  @IsObject()
  versions: AddonVersionDto;

  @IsArray()
  volumes: AddonVolumeDto[];

  @IsArray()
  envs: AddonEnvDto[];

  @IsDate()
  creationDate: Date;

  @IsDate()
  updateTime: Date;

  constructor(addon: Addon) {
    this.id = addon.id;
    this.name = addon.name;
    this.description = addon.description;
    this.logo = addon.logo;
    this.versions = addon.versions;
    this.volumes = addon.volumes.getItems();
    this.envs = addon.envs.getItems();
    this.creationDate = addon.creationDate;
    this.updateTime = addon.updateTime;
  }
}

export class AddonRequestDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  logo: string;

  @IsObject()
  versions: AddonVersionRequestDto;

  @IsArray()
  volumes: AddonVolumeRequestDto[];

  @IsArray()
  envs: AddonEnvRequestDto[];
}
