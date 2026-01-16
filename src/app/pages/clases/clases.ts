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

  constructor(private servicesService: ServicesService) { }


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
      const res = await this.servicesService.reserveClass(classId);
      if (res.success) {
        const item = this.gymClasses.find(c => c.id === classId);
        if (item) item.isReservedByUser = true;
        console.log('Reserva exitosa');
      } else {
        alert(res.message || 'No se pudo reservar');
      }
    } catch (err: any) {
      console.error('Error en reserva:', err);
      alert(err?.error?.message || 'Error al reservar');
    }
  }

  async cancel(classId: number) {
    try {
      const res = await this.servicesService.cancelReservation(classId);
      if (res.success) {
        const item = this.gymClasses.find(c => c.id === classId);
        if (item) item.isReservedByUser = false;
        console.log('Cancelación exitosa');
      } else {
        alert(res.message || 'No se pudo cancelar');
      }
    } catch (err: any) {
      console.error('Error al cancelar:', err);
      alert(err?.error?.message || 'Error al cancelar');
    }
  }

  getDayName(day: number): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[day] ?? '';
  }
}
