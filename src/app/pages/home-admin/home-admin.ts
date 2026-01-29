import { Component, inject } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './home-admin.html',
  styles: ``,
})
export default class HomeAdmin {
  private services = inject(ServicesService);

  cardData = [
    {
      title: 'Agregar Clases',
      text: 'Crear clases disponibles en el gimnasio.',
      buttonName: 'Ir a Clases',
      pathname: '/admin/clases/nueva',
      icon: 'fas fa-dumbbell'
    },
    {
      title: 'Gestionar Usuarios',
      text: 'Ver, editar o eliminar usuarios registrados en el sistema.',
      buttonName: 'Ir a Usuarios',
      pathname: '/admin/user-list',
      icon: 'fas fa-users'
    },
    {
      title: 'Gestionar Planes',
      text: 'Crear, editar o eliminar tipos de planes disponibles.',
      buttonName: 'Ir a Planes',
      pathname: '/admin/planes',
      icon: 'fas fa-file-invoice-dollar'
    }
  ];
}