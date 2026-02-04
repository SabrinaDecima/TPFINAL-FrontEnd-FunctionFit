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
    const history = await this.servicesService.getPaymentHistory();
    const mapped = history.map(p => this.mapToPayment(p));

    // 🔴 pago impago más reciente
    const pending = mapped
      .filter(p => !p.Pagado)
      .sort((a, b) => new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime())[0];

    this.currentPayment.set(pending ?? null);

    // 🟢 historial SIN el pago actual
    this.paymentHistory.set(
      mapped.filter(p => p !== pending)
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
    Id: p.Id ?? p.id,
    UserId: p.UserId ?? p.userId,
    Monto: p.Monto ?? p.monto,
    Fecha: p.Fecha ?? p.fecha,
    Pagado: p.Pagado ?? p.pagado,
    InitPoint: p.InitPoint ?? p.initPoint
  };
}


  // Iniciar pago
  async pay() {
  const payment = this.currentPayment();
  if (!payment) return;

  try {
    const res = await this.servicesService.createMercadoPagoPayment({
      Monto: payment.Monto
    });

    // 🚀 Redirección PRO
    window.location.href = res.initPoint;

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

  const [_ ,day, month, year] = fecha.split('-');

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  return `${_} ${day} de ${meses[Number(month) - 1]} ${year}`;
}


}
