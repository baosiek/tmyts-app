import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./components/panels/dashboards/assets-analysis/assets-analysis').then(
                (m) => m.AssetsAnalysis
            );
        },
    },
    {
        path: 'scanners',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./components/panels/dashboards/assets-analysis/assets-analysis').then(
                (m) => m.AssetsAnalysis
            );
        },
    },
];
