import { Component, input, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ServicesService } from '../../../services/services.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {
  name = input<string>('');
  private svc = inject(ServicesService);

  currentUser = this.svc._currentUser;

  menuItems = computed(() => {
    const user = this.currentUser();
    if (!user) return [];

    const items: { label: string; route: string }[] = [];

    if (user.role === 'Socio') {
      items.push({ label: 'Page-1', route: '/page-1' });
    }

    if (user.role === 'Administrador' || user.role === 'SuperAdministrador') {
      items.push({ label: 'Page-2', route: '/page-2' });
    }

    if (user.role === 'SuperAdministrador') {
      items.push({ label: 'Page-3', route: '/page-3' });
    }

    return items;
  });
}