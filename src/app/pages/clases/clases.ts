import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { CommonModule } from '@angular/common';
import { GymClass } from '../../shared/interfaces/gym-class.interface';
import { GroupedGymClass, GymClassTurn } from '../../shared/interfaces/grouped-gym-class.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gym-classes',
  templateUrl: './clases.html',
  standalone: true,
  imports: [CommonModule]
})
export class GymClassesComponent implements OnInit {
  groupedClasses: GroupedGymClass[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private servicesService: ServicesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadClasses();
  }

  async loadClasses() {
    this.loading = true;
    this.error = null;
    try {
      const classes = await this.servicesService.getGymClasses();
      this.groupedClasses = this.groupClasses(classes);
    } catch (err) {
      console.error(err);
      this.error = 'No se pudieron cargar las clases';
    } finally {
      this.loading = false;
    }
  }

  private groupClasses(classes: GymClass[]): GroupedGymClass[] {
    const map = new Map<string, GroupedGymClass>();
    for (const c of classes) {
      if (!map.has(c.nombre)) {
        map.set(c.nombre, {
          nombre: c.nombre,
          descripcion: c.descripcion,
          duracionMinutos: c.duracionMinutos,
          imageUrl: c.imageUrl,
          turnos: []
        });
      }
      const turno: GymClassTurn = {
        id: c.id,
        dia: c.dia,
        hora: c.hora,
        isReservedByUser: c.isReservedByUser,
        maxCapacity: c.maxCapacity,
        currentEnrollments: c.currentEnrollments
      };
      map.get(c.nombre)!.turnos.push(turno);
    }
    return Array.from(map.values());
  }

  async reserve(classId: number) {
    try {
      const res = await this.servicesService.reserveClass(classId);
      if (res.success) {
        this.updateTurnoState(
          classId,
          true,
          res.currentEnrollments,
          res.maxCapacity
        );
        this.toastr.success('¡Reserva confirmada!');
      } else {
        this.toastr.error(res.message || 'No se pudo reservar', 'Error');
      }
    } catch (err: any) {
      this.toastr.error(err?.error?.message || 'Error al reservar', 'Error');
    }
  }

  async cancel(classId: number) {
    try {
      const res = await this.servicesService.cancelReservation(classId);
      if (res.success) {
        this.updateTurnoState(
          classId,
          false,
          res.currentEnrollments,
          res.maxCapacity
        );
        this.toastr.info('Reserva cancelada');
      } else {
        this.toastr.warning(res.message || 'No se pudo cancelar', 'Atención');
      }
    } catch (err: any) {
      this.toastr.error(err?.error?.message || 'Error al cancelar', 'Error');
    }
  }

  private updateTurnoState(classId: number, isReserved: boolean, currentEnrollments?: number, maxCapacity?: number) {
    for (const group of this.groupedClasses) {
      const turno = group.turnos.find(t => t.id === classId);
      if (turno) {
        turno.isReservedByUser = isReserved;
        if (currentEnrollments !== undefined) {
          turno.currentEnrollments = currentEnrollments;
        }
        if (maxCapacity !== undefined) {
          turno.maxCapacity = maxCapacity;
        }
        break;
      }
    }
  }

  getDayName(day: number): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[day] ?? '';
  }

  getAvailabilityMessage(turno: { maxCapacity: number; currentEnrollments: number }): string {
    const available = turno.maxCapacity - turno.currentEnrollments;
    if (available <= 0) return '¡Completa!';
    if (available === 1) return 'Queda 1 lugar';
    return `Quedan ${available} lugares`;
  }
}