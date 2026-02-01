import { Component, input, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ServicesService } from '../../../services/services.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styles: ``
})
export class Sidebar {
  name = input<string>('');
  private svc = inject(ServicesService);

  currentUser = this.svc._currentUser;

  menuItems = computed(() => {
    const user = this.currentUser();
    if (!user) return [];

    const items: { label: string; route: string; icon: string }[] = [];

    if (user.role === 'Socio') {
      items.push(
        { label: 'Clases Disponibles', route: '/clases', icon: 'fa-dumbbell' },
        { label: 'Historial', route: '/historial', icon: 'fa-history' },
        { label: 'Pagos', route: '/pagos', icon: 'fa fa-credit-card' }
      );
    }

    if (user.role === 'Administrador' || user.role === 'SuperAdministrador') {
      items.push({ label: 'Usuarios', route: '/admin/user-list', icon: 'fa-users' });
      items.push({ label: 'Clases', route: '/admin/clases', icon: 'fa-dumbbell' });
      items.push({ label: 'Agregar Clase', route: '/admin/clases/nueva', icon: 'fa-plus-circle' });
      items.push({ label: 'Gestionar Planes', route: '/admin/planes', icon: 'fa-file-invoice-dollar' });
    }

    if (user.role === 'SuperAdministrador') {
      items.push({ label: 'Page-3', route: '/page-3', icon: 'fa-cog' });
    }

    return items;
  });
}