import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styles: ``
})
export default class ForgotPassword {

  
  loading = signal(false);
  success = signal(false);
  message = signal('');
  errorMessage = signal('');
  authService = inject(AuthService);
  private router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.message.set('');
    this.errorMessage.set('');

    try {
      const email = this.form.value.email;
      if (!email) return;
      
      await this.authService.forgotPassword(email);
      this.message.set('Si el correo existe en nuestro sistema, recibirás un email con instrucciones para restablecer tu contraseña.');
    } catch (error) {
      this.errorMessage.set('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.');
    } finally {
      this.loading.set(false);
    }
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
