import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { GymClass } from '../../shared/interfaces/gym-class.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gym-classes',
  templateUrl: './clases.html',
  standalone: true, 
  imports: [CommonModule]
})
export class GymClassesComponent implements OnInit {

  gymClasses: GymClass[] = [];
  loading = false;
  error: string | null = null;

  constructor(private servicesService: ServicesService) {}
  

  ngOnInit(): void {
    this.loadClasses();
  }

  async loadClasses() {
    this.loading = true;
    this.error = null;

    try {
      this.gymClasses = await this.servicesService.getGymClasses();
    } catch (err) {
      console.error(err);
      this.error = 'No se pudieron cargar las clases';
    } finally {
      this.loading = false;
    }
  }

  async reserve(classId: number) {
    try {
      await this.servicesService.reserveClass(classId);
      await this.loadClasses(); 
    } catch (err: any) {
      alert(err?.error ?? 'Error al reservar');
    }
  }

  async cancel(classId: number) {
    try {
      await this.servicesService.cancelReservation(classId);
      await this.loadClasses();
    } catch (err: any) {
      alert(err?.error ?? 'Error al cancelar');
    }
  }

  getDayName(day: number): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[day] ?? '';
  }
}
