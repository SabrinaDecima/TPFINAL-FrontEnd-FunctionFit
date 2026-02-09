import { Component, inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GymClassService } from '../../../services/gym-class.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { GymClass } from '../../../shared/interfaces';

@Component({
  selector: 'app-gym-class-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gym-class-form.component.html',
  styleUrl: './gym-class-form.component.scss'
})
export class GymClassFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private gymClassService = inject(GymClassService);
  private toastr = inject(ToastrService);

  @Input() gymClassToEdit: GymClass | null = null;
  @Output() onClose = new EventEmitter<void>();

  days = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' }
  ];

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: ['', [Validators.required]],
    duracionMinutos: [60, [Validators.required, Validators.min(10), Validators.max(180)]],
    imageUrl: ['Clase', [Validators.required]],
    dia: [1, [Validators.required]],
    hora: ['08:00', [Validators.required]],
    maxCapacity: [10, [Validators.required, Validators.min(1), Validators.max(50)]]
  });

  isLoading = false;
  isEditMode = false;

  constructor() {
    this.loadGymClassData();
  }

  ngOnInit() {
    this.loadGymClassData();
  }

  loadGymClassData() {
    if (this.gymClassToEdit) {
      this.isEditMode = true;
      this.form.patchValue({
        nombre: this.gymClassToEdit.nombre,
        descripcion: this.gymClassToEdit.descripcion,
        duracionMinutos: this.gymClassToEdit.duracionMinutos,
        dia: this.gymClassToEdit.dia,
        hora: this.gymClassToEdit.hora,
        maxCapacity: this.gymClassToEdit.maxCapacity,
        imageUrl: this.gymClassToEdit.imageUrl || 'Clase'
      });
    }
  }

  timeValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(value) ? null : { invalidTime: true };
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.toastr.error('Por favor, completa todos los campos correctamente');
      return;
    }

    this.isLoading = true;
    try {
      const formData = this.form.getRawValue();

      if (this.isEditMode) {
        if (this.gymClassToEdit) {
          await this.gymClassService.editGymClass(this.gymClassToEdit.id, formData).toPromise();
          this.toastr.success('Clase actualizada correctamente');
        }
      } else {
        await this.gymClassService.createGymClass(formData).toPromise();
        this.toastr.success('Clase creada correctamente');
      }

      this.onClose.emit();
    } catch (err: any) {
      const errorMessage = this.isEditMode ? 'Error al actualizar la clase' : 'Error al crear la clase';
      this.toastr.error(errorMessage);
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  close() {
    this.onClose.emit();
  }
}
