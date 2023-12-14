import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'applications',
        children: [
            {
                path: '',
                loadComponent: () => import('./modules/applications/applications.component').then(m => m.ApplicationsComponent)
            },
            {
                path: 'create',
                loadComponent: () => import('./modules/applications/create/create.component').then(m => m.CreateComponent)
            },
            {
                path: ':id',
                loadComponent: () => import('./modules/applications/id/id.component').then(m => m.IdComponent)
            }
        ]
    }
];
