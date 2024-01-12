import { Controller } from '@nestjs/common';

import { AddonVersionService } from './addon-version.service';

@Controller('addon-version')
export class AddonVersionController {
  constructor(private addonVersionService: AddonVersionService) {}
}
