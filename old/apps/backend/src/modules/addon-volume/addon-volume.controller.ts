import { Controller } from '@nestjs/common';

import { AddonVolumeService } from './addon-volume.service';

@Controller('addon-volume')
export class AddonVolumeController {
  constructor(private addonVolumeService: AddonVolumeService) {}
}
