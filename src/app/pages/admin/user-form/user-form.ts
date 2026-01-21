import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminUserService, CreateUserByAdminRequest } from '../../../services/adminUser.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  private fb = inject(FormBuilder);
  private adminUserService = inject(AdminUserService);
  private toastr = inject(ToastrService);

  userForm = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
    email: ['', [Validators.required, Validators.email]],
    planId: ['', [Validators.required]],
    roleId: ['', [Validators.required]],
    contraseña: ['', [Validators.required]],
  });

  constructor() {
    // Escuchar cambios en roleId
    this.userForm.get('roleId')?.valueChanges.subscribe(roleId => {
      if (roleId == "1") { // 1 = Socio
        this.userForm.get('planId')?.enable();
        this.userForm.get('planId')?.setValidators([Validators.required]);
      } else {
        this.userForm.get('planId')?.reset();
        this.userForm.get('planId')?.disable();
        this.userForm.get('planId')?.clearValidators();
      }
      this.userForm.get('planId')?.updateValueAndValidity();
    });
  }


  async onSubmit() {
    if (this.userForm.invalid) return;

    const payload: CreateUserByAdminRequest = this.userForm.value as unknown as CreateUserByAdminRequest;

    console.log(this.userForm.getRawValue())


    try {
      const response = await this.adminUserService.createUser(payload);
      this.toastr.success(response.message);
      this.userForm.reset();   // limpiar formulario
    } catch (error:any) {
      this.toastr.error(error, 'Error'); // mostrar error del backend
    }
  }

  
}   
