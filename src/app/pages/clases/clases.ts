import { Component, inject, signal } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { GymClass } from '../../shared/interfaces/gym-class.interface';


@Component({
  selector: 'app-clases',
  imports: [],
  templateUrl: './clases.html',
  styles: ``
})
export default class Clases {
  private svc = inject(ServicesService);

  gymClasses = signal<GymClass[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.loadClasses();
  }

  async loadClasses() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const classes = await this.svc.getGymClasses();
      this.gymClasses.set(classes);
    } catch (err) {
      console.error('Error fetching classes:', err);
      this.error.set('No se pudieron cargar las clases');
    } finally {
      this.loading.set(false);
    }
  }
}
