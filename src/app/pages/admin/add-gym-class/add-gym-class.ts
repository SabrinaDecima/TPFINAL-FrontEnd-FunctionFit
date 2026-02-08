import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesService } from '../../../services/services.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { CreateGymClassRequest } from '../../../shared/interfaces';


@Component({
    selector: 'app-add-gym-class',
    templateUrl: './add-gym-class.html',
    imports: [
        CommonModule,
        ReactiveFormsModule
    ]
})
export default class AddGymClass {
    private fb = inject(FormBuilder);
    private services = inject(ServicesService);
    protected router = inject(Router);
    private toastr = inject(ToastrService);

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
        imageUrlText: ['Clase', [Validators.required]],
        dia: [1, [Validators.required]],
        hora: ['08:00', [Validators.required, this.timeValidator]],
        maxCapacity: [10, [Validators.required, Validators.min(1), Validators.max(50)]]
    });

    timeValidator(control: any) {
        const value = control.value;
        if (!value) return null;
        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return regex.test(value) ? null : { invalidTime: true };
    }

    async onSubmit() {
        if (this.form.invalid) return;

        const rawValue = this.form.getRawValue();
        const request: CreateGymClassRequest = {
            ...rawValue,
            dia: +rawValue.dia,
            imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(rawValue.imageUrlText)}&font=montserrat` 
        };

        try {
            const newClass = await this.services.createGymClass(request);
            this.toastr.success(`Clase "${newClass.nombre}" creada correctamente`);
            this.router.navigate(['/home-admin']);
        } catch (err: any) {
            console.error(err);
            const msg = err?.error?.message || 'Error al crear la clase';
            this.toastr.error(msg);
        }
    }

    goToHomeAdmin() {
        this.router.navigate(['/home-admin']);
    }
}