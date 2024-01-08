import { IsDate, IsNumber, IsString } from 'class-validator';

export class AppConfigurationDto {
  @IsString()
  id: string;

  @IsNumber()
  dockerRegistryPort: number;

  @IsDate()
  creationDate: Date;

  @IsDate()
  updateDate: Date;
}

export class AppConfigurationRequestDto {
  @IsNumber()
  dockerRegistryPort: number;
}
