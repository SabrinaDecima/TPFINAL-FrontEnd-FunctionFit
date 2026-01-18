import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from './services/services.service';
import { roleGuard } from './core/guards/role.guard';


const authGuard = () => {
    const servicesService = inject(ServicesService);
    const router = inject(Router);
    if (servicesService.isAuthenticated()) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};

const redirectIfLoggedIn = () => {
    const servicesService = inject(ServicesService);
    const router = inject(Router);
    if (servicesService.isAuthenticated()) {
        router.navigate(['/']);
        return false;
    }
    return true;
};

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login'),
        canActivate: [redirectIfLoggedIn]
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./pages/forgot-password/forgot-password'),
        canActivate: [redirectIfLoggedIn]
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./pages/reset-password/reset-password'),
        canActivate: [redirectIfLoggedIn]
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./shared/components/layout/layout'),
        children: [
            { path: '', loadComponent: () => import('./pages/home/home') },
            {
                path: 'clases',
                loadComponent: () =>
                import('./pages/clases/clases')
                .then(m => m.GymClassesComponent),
                canActivate: [roleGuard('Socio')]
            },
            {
                path: 'historial',
                loadComponent: () => 
                import('./pages/historical/historical')
                .then(m => m.HistoricalComponent),
                canActivate: [roleGuard('Socio')]
            },
            {
                path: 'page-3',
                loadComponent: () => import('./pages/page-3/page-3'),
                canActivate: [roleGuard('SuperAdministrador')]
            },
            { path: 'home', redirectTo: '', pathMatch: 'full' }
        ]
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register'),
        canActivate: [redirectIfLoggedIn]
    },
    { path: '**', redirectTo: '' }
];