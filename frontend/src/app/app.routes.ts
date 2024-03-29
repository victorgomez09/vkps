import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'applications',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./routes/applications/applications.component').then(
            (c) => c.ApplicationsComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./routes/applications/id/id.component').then(
            (c) => c.IdComponent
          ),
      },
    ],
  },
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
