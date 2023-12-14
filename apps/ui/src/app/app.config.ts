import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from '@angular/router';
import { TuiRootModule } from "@taiga-ui/core";

import { provideHttpClient } from "@angular/common/http";
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), provideHttpClient(), provideRouter(routes), importProvidersFrom(TuiRootModule)]
};
