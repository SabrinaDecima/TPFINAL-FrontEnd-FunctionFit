import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styles: ``
})
export default class ForgotPassword {

  loading = false;
  success = false;

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  constructor(private router: Router) { }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    // Simulacion backend
    setTimeout(() => {
      this.loading = false;
      this.success = true;
    }, 1500);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
