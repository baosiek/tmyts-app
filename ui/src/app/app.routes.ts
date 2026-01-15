import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('.//components/panels/dashboards/portfolios/portfolios').then(
                (m) => m.Portfolios
            );
        },
    },
    {
        path: 'portfolio_management',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./components/panels/dashboards/portfolios/portfolios').then(
                (m) => m.Portfolios
            );
        },
    },
    {
        path: 'assets_analysis',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./components/panels/dashboards/assets-analysis/assets-analysis').then(
                (m) => m.AssetsAnalysis
            );
        },
    },
    {
        path: 'live-data',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./components/panels/dashboards/live-data/live-data').then(
                (m) => m.LiveData
            );
        },
    },
];
