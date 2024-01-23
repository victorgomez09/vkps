import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'addons',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./routes/addons/addons.component').then(
            (c) => c.AddonsComponent
          ),
      },
      {
        path: 'new/:name',
        loadComponent: () =>
          import('./routes/addons/new/new.component').then(
            (c) => c.NewComponent
          ),
      },
    ],
  },
];
