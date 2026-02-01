import { Component, computed, inject, signal } from '@angular/core';
import { GymClassService } from '../../../services/gym-class.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GymClass } from '../../../shared/interfaces/gym-class.interface';
import { GymClassFormComponent } from '../gym-class-form/gym-class-form.component';

@Component({
  selector: 'app-gym-class-management',
  imports: [FormsModule, CommonModule, GymClassFormComponent],
  templateUrl: './gym-class-management.html',
  styleUrl: './gym-class-management.scss',
})
export default class GymClassManagement {
  private gymClassService = inject(GymClassService);
  private toastr = inject(ToastrService);

  searchTerm = signal('');
  gymClasses = signal<GymClass[]>([]);
  showForm = signal(false);
  selectedGymClass: GymClass | null = null;

  showConfirmDialog = false;
  pendingDeleteId: number | null = null;

  days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  constructor() {
    this.loadGymClasses();
  }

  async loadGymClasses() {
    try {
      const allClasses = await this.gymClassService.getAllGymClasses().toPromise();
      if (allClasses) {
        this.gymClasses.set(allClasses);
      }
    } catch (err: any) {
      this.toastr.error('Error al cargar las clases', 'Error');
    }
  }

  filteredGymClasses = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allClasses = this.gymClasses();

    if (!allClasses || allClasses.length === 0) {
      return [];
    }
    return allClasses.filter(c =>
      (c.nombre?.toLowerCase() ?? '').includes(term) ||
      (c.descripcion?.toLowerCase() ?? '').includes(term)
    );
  });

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  editGymClass(gymClass: GymClass) {
    this.selectedGymClass = gymClass;
    this.showForm.set(true);
  }

  confirmDelete(id: number) {
    this.pendingDeleteId = id;
    this.showConfirmDialog = true;
  }

  cancelDelete() {
    this.showConfirmDialog = false;
    this.pendingDeleteId = null;
  }

  async deleteGymClass(id: number | null) {
    if (!id) return;
    try {
      const res = await this.gymClassService.deleteGymClass(id).toPromise();
      this.toastr.success('Clase eliminada correctamente');
      await this.loadGymClasses();
    } catch (err: any) {
      this.toastr.error('Error al eliminar la clase', 'Error');
    } finally {
      this.showConfirmDialog = false;
      this.pendingDeleteId = null;
    }
  }

  onFormClose() {
    this.showForm.set(false);
    this.selectedGymClass = null;
    this.loadGymClasses();
  }
}
