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

  // Estado
  currentPayment = signal<Payment | null>(null);
  paymentHistory = signal<Payment[]>([]);
  loading = signal<boolean>(true);

  constructor() {
    this.loadPayments();
  }

  async loadPayments() {
    this.loading.set(true);

    try {
      // 🔹 Pago pendiente (OBJETO o null)
      const pending = await this.servicesService.getPendingPayment();
      console.log('PENDING FROM API 👉', pending);

      this.currentPayment.set(
        pending ? this.mapToPayment(pending) : null
      );

      // 🔹 Historial (ARRAY)
      const history = await this.servicesService.getPaymentHistory();
      this.paymentHistory.set(
        history.map(p => this.mapToPayment(p))
      );

    } catch (err) {
      console.error('Error al cargar pagos:', err);
      this.currentPayment.set(null);
      this.paymentHistory.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  // Mapper seguro
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

  // Iniciar pago
  async pay() {
    if (!this.currentPayment()) return;

    try {
      const res = await this.servicesService.createMercadoPagoPayment({
        Monto: this.currentPayment()!.Monto
      });

      // Redirección a Mercado Pago
      window.location.href = res.Url;

    } catch (err) {
      console.error('Error al iniciar pago:', err);
    }
  }

  // Utilidad: saber si hay deuda
  hasPendingPayment(): boolean {
    return !!this.currentPayment() && !this.currentPayment()!.Pagado;
  }

  // Formateo de fecha
  formatDate(fecha?: string) {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-AR', {
      month: 'long',
      year: 'numeric'
    });
  }
}
