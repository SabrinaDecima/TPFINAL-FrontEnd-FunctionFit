import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.html',
  styles: ``
})

export default class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private authService = inject(AuthService);
  private router = inject(Router);
  token = signal<string | null>(null);

  form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ])
  }, { validators: this.passwordsMatchValidator.bind(this) });

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  ngOnInit() {
    // Captura el token de la URL automáticamente
    this.token.set(this.route.snapshot.queryParamMap.get('token'));
    
    if (!this.token()) {
      // Redirigir si no hay token
    }
  }

  async onReset() {
    if (this.form.invalid) return;

    const password = this.form.value.password;
    if (!password) return;

    const data = {
      token: this.token(),
      newPassword: password
    };
    
    try {
      await this.authService.resetPassword(data);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
    }
  }
}