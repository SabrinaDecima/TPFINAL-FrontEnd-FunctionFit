import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-status.html'
})
export default class SubscriptionStatus implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  // Signal para manejar la data
  subscription = signal<any>(null);

  ngOnInit() {
    this.loadStatus();
  }

  async loadStatus() {


    try {
      const profile = await this.userService.getMe();
      this.subscription.set(profile);
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
    }
  }

  goToPayments() {
    this.router.navigate(['/pagos']);
  }
}
