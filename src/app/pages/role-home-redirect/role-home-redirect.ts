import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../../services/services.service';

@Component({
    template: '',
    standalone: true
})
export default class RoleHomeRedirect {
    constructor() {
        const svc = inject(ServicesService);
        const router = inject(Router);
        const user = svc._currentUser();

        if (!user) {
            router.navigate(['/login']);
            return;
        }

        switch (user.role) {
            case 'Socio':
                router.navigate(['/home-socio']);
                break;
            case 'Administrador':
                router.navigate(['/home-admin']);
                break;
            case 'SuperAdministrador':
                router.navigate(['/home-super-admin']);
                break;
            default:
                router.navigate(['/login']);
        }
    }
}