import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/landing/landing.component').then((m) => m.LandingComponent)
  },
  {
    path: 'deployments',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/deployments/deployments.component').then((m) => m.DeploymentsComponent)
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./modules/deployments/new/new.component').then((m) => m.NewComponent)
      }
    ]
  }
];
