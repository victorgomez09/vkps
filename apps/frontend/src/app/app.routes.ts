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
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./components/deployment-layout/deployment-layout.component').then(
            (m) => m.DeploymentLayoutComponent
          ),
        children: [
          {
            path: 'details',
            loadComponent: () =>
              import('./modules/deployments/id/details/details.component').then(
                (m) => m.DetailsComponent
              )
          },
          {
            path: 'buildpack',
            loadComponent: () =>
              import('./modules/deployments/id/buildpack/buildpack.component').then(
                (m) => m.BuildpackComponent
              )
          },
          {
            path: 'config',
            loadComponent: () =>
              import('./modules/deployments/id/id.component').then((m) => m.IdComponent)
          },
          {
            path: 'logs',
            loadComponent: () =>
              import('./modules/deployments/id/logs/logs.component').then((m) => m.LogsComponent)
          }
        ]
      }
    ]
  }
];
