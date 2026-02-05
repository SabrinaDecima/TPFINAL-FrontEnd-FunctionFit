import { Component, inject, signal } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { Payment } from '../../shared/interfaces/payment.interface';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.html',
  styles: [],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export default class Pagos {

  private servicesService = inject(ServicesService);
  private router = inject(Router);

  // Estado
  currentPayment = signal<Payment | null>(null);
  paymentHistory = signal<Payment[]>([]);
  loading = signal<boolean>(true);
  checkingPayment = signal<boolean>(false);

  constructor() {
    this.loadPayments();
    this.checkForMercadoPagoRedirect();
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

  // Detectar retorno de Mercado Pago y notificar al backend
  private async checkForMercadoPagoRedirect() {
    try {
      const params = new URLSearchParams(window.location.search);
      const paymentId = params.get('payment_id') || params.get('collection_id') || params.get('id') || params.get('collection_id_from_callback') || params.get('preference_id');

      if (paymentId) {
        this.checkingPayment.set(true);
        // Llamamos al webhook local para que reconcilie el pago con Mercado Pago
        await this.servicesService.notifyMercadoPago(paymentId);

        // Quitamos params de la URL para evitar re-procesarlo si recargas
        if (window.history && window.history.replaceState) {
          const url = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, url);
        }

        // Recargamos pagos
        await this.loadPayments();
        this.checkingPayment.set(false);
      }
    } catch (err) {
      console.error('Error comprobando redirección de MercadoPago:', err);
    }
  }


  // Utilidad: saber si hay deuda
  hasPendingPayment(): boolean {
    return !!this.currentPayment() && !this.currentPayment()!.Pagado;
  }

  // Verificación manual si el usuario tiene el payment_id de MercadoPago
  verificationId = signal<string>('');

  async verifyPaymentWithId() {
    const id = this.verificationId();
    if (!id) return;

    try {
      this.checkingPayment.set(true);
      await this.servicesService.notifyMercadoPago(id);
      await this.loadPayments();
    } catch (err) {
      console.error('Error verificando pago:', err);
    } finally {
      this.checkingPayment.set(false);
      this.verificationId.set('');
    }
  }

  // Formateo de fecha: "HH:MM DD de <mes> de AAAA"
  formatDate(fecha?: string) {
    if (!fecha) return '';

    let date = new Date(fecha);

    // Intentar soportar formatos comunes como DD-MM-YYYY o "DD-MM-YYYY HH:MM"
    if (isNaN(date.getTime())) {
      const [datePart, timePart] = fecha.split(' ');
      const [d, m, y] = (datePart || '').split('-');
      if (y && m && d) {
        date = new Date(`${y}-${m}-${d}${timePart ? 'T' + timePart : ''}`);
      }
    }

    if (isNaN(date.getTime())) return '';

    const pad = (n: number) => String(n).padStart(2, '0');
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const day = pad(date.getDate());
    const year = date.getFullYear();

    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const monthName = meses[date.getMonth()];

    return `${hours}:${minutes} ${day} de ${monthName} de ${year}`;
  }


}
