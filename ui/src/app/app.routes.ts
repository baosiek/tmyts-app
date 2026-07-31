import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: 'login',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./components/login/login').then(
                (m) => m.Login
            );
        },
    },
    {
        path: '',
        pathMatch: 'full',
        canActivate: [authGuard],
        loadComponent: () => {
            return import('.//components/panels/dashboards/portfolios/portfolios').then(
                (m) => m.Portfolios
            );
        },
    },
    {
        path: 'portfolio_management',
        pathMatch: 'full',
        canActivate: [authGuard],
        loadComponent: () => {
            return import('./components/panels/dashboards/portfolios/portfolios').then(
                (m) => m.Portfolios
            );
        },
    },
    {
        path: 'assets_analysis',
        pathMatch: 'full',
        canActivate: [authGuard],
        loadComponent: () => {
            return import('./components/panels/dashboards/assets-analysis/assets-analysis').then(
                (m) => m.AssetsAnalysis
            );
        },
    },
    {
        path: 'live-data',
        pathMatch: 'full',
        canActivate: [authGuard],
        loadComponent: () => {
            return import('./components/panels/dashboards/live-data/live-data').then(
                (m) => m.LiveData
            );
        },
    },
    {
        path: 'live-tracker',
        pathMatch: 'full',
        canActivate: [authGuard],
        loadComponent: () => {
            return import('./components/panels/dashboards/live-tracker/live-tracker').then(
                (m) => m.LiveTracker
            );
        },
    },
    {
        path: 'control-panel',
        pathMatch: 'full',
        canActivate: [authGuard],
        loadComponent: () => {
            return import('./components/panels/dashboards/control-panel/control-panel').then(
                (m) => m.ControlPanel
            );
        },
    },
];
