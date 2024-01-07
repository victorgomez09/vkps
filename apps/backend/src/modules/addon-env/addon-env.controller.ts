import { Controller } from '@nestjs/common';

import { AddonEnvService } from './addon-env.service';

@Controller('addon-env')
export class AddonEnvController {
  constructor(private addonEnvService: AddonEnvService) {}
}
