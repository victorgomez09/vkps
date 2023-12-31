import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogLines } from 'engine';

import { DeploymentDto, DeploymentRequestDto } from './deployment.dto';
import { DeploymentService } from './deployment.service';

@ApiTags('deployments')
@Controller('/deployments')
export class DeploymentController {
  constructor(private deploymentService: DeploymentService) {}

  @Get('')
  async getAll(): Promise<DeploymentDto[]> {
    const deployment = await this.deploymentService.findAll();

    return deployment.map((d) => new DeploymentDto(d));
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<DeploymentDto> {
    return new DeploymentDto(await this.deploymentService.findById(id));
  }

  @Get('name/:id')
  async getByName(@Param('name') name: string): Promise<DeploymentDto> {
    return new DeploymentDto(await this.deploymentService.findByName(name));
  }

  @Get('logs/:id')
  async getLogs(@Param('id') id: string): Promise<LogLines[]> {
    return await this.deploymentService.findLogsById(id);
  }

  @Post('')
  async createDraft(
    @Body() deploymentData: DeploymentRequestDto,
  ): Promise<DeploymentDto> {
    return new DeploymentDto(
      await this.deploymentService.create(deploymentData),
    );
  }

  @Post('deploy/:id')
  async deploy(@Param('id') id: string): Promise<DeploymentDto> {
    return new DeploymentDto(await this.deploymentService.deploy(id));
  }

  @Put(':id')
  async publishPost(
    @Param('id') id: string,
    @Body() deploymentData: DeploymentRequestDto,
  ): Promise<DeploymentDto> {
    const {
      cpu,
      description,
      envs,
      exposedNetwork,
      image,
      memory,
      name,
      port,
      replicas,
      volumes,
    } = deploymentData;
    return new DeploymentDto(
      await this.deploymentService.update(id, {
        cpu,
        description,
        envs,
        exposedNetwork,
        image,
        memory,
        name,
        port,
        replicas,
        volumes,
      }),
    );
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<void> {
    this.deploymentService.delete(id);
  }
}
