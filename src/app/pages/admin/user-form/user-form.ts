import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from '../../../services/register.service';

@Component({
  selector: 'app-user-form',
  imports: [],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);

  userForm = this.fb.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
    email: ['', [Validators.required, Validators.email]],
    plan: ['', [Validators.required]]
    });
}
