import { Component, inject, signal } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { Payment } from '../../shared/interfaces/payment.interface';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.html',
  styles: [],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export default class Pagos {
  private servicesService = inject(ServicesService);
  private router = inject(Router);

  currentPayment = signal<Payment | null>(null);
  paymentHistory = signal<Payment[]>([]);
  loading = signal<boolean>(true);

  constructor() {
    this.loadPayments();
  }

  async loadPayments() {
    this.loading.set(true);
    try {
      
      const pending = await this.servicesService.getPendingPayment();
      this.currentPayment.set(pending.length ? this.mapToPayment(pending[0]) : null);

      
      const history = await this.servicesService.getPaymentHistory();
      this.paymentHistory.set(history.map(p => this.mapToPayment(p)));
    } catch (err) {
      console.error('Error al cargar pagos:', err);
    } finally {
      this.loading.set(false);
    }
  }

  mapToPayment(p: any): Payment {
    return {
      Id: p.Id,
      UserId: p.UserId,
      Monto: p.Monto,
      Fecha: p.Fecha,
      Pagado: p.Pagado,
      InitPoint: p.InitPoint
    };
  }

  async pay() {
    if (!this.currentPayment()) return;

    try {
      const res = await this.servicesService.createMercadoPagoPayment({
        Monto: this.currentPayment()!.Monto
      });

      
      window.location.href = res.Url;

    } catch (err) {
      console.error('Error al iniciar pago:', err);
    }
  }

  
  hasPendingPayment(): boolean {
    return this.currentPayment() !== null && !this.currentPayment()?.Pagado;
  }

  formatDate(fecha?: string) {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  }
}
