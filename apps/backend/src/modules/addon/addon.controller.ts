import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AddonService } from './addon.service';
import { AddonDto, AddonRequestDto } from './addon.dto';

@Controller('addons')
export class AddonController {
  constructor(private addonService: AddonService) {}

  @Get()
  async findAll() {
    const addons = await this.addonService.findAll();

    return addons.map((addon) => new AddonDto(addon));
  }

  @Get(':id')
  async findById(@Param() id: string) {
    return new AddonDto(await this.addonService.findById(id));
  }

  @Post()
  async create(@Body() data: AddonRequestDto) {
    return new AddonDto(await this.addonService.create(data));
  }
}
