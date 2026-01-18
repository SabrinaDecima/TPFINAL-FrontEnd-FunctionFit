import { Component, inject, signal } from '@angular/core';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styles: ``
})
export default class Home {
  private servicesService = inject(ServicesService);
  enrolledClasses = signal<
    { id: number; nombre: string; dia: number; hora: string }[]
  >([]);

  constructor() {
    this.loadUserClasses();
  }

  async loadUserClasses() {
    try {
      const data = await this.servicesService.getCurrentUserWithClasses();
      this.enrolledClasses.set(data.enrolledClasses);
    } catch (err) {
      console.error('Error al cargar clases:', err);
    }
  }

  getDayName(day: number): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[day] ?? '';
  }
}
