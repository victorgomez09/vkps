import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'addons',
    loadComponent: () =>
      import('./routes/addons/addons.component').then((c) => c.AddonsComponent),
  },
];
