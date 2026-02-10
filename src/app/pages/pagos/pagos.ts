import { Component, inject, signal } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Payment } from '../../shared/interfaces';

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
    this.checkForMercadoPagoReturn();
  }

  async loadPayments() {
    this.loading.set(true);

    try {
      const history = await this.servicesService.getPaymentHistory();
      const mapped = history.map(p => this.mapToPayment(p));

      // Pago pendiente más reciente
      const pending = mapped
        .filter(p => !p.Pagado)
        .sort((a, b) => new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime())[0];

      this.currentPayment.set(pending ?? null);

      // Historial sin el pago actual
      this.paymentHistory.set(mapped.filter(p => p !== pending));

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

  async pay() {
    const payment = this.currentPayment();
    if (!payment) return;

    try {
      const user = this.servicesService.getCurrentUser();
      const res = await this.servicesService.createMercadoPagoPayment({
        Monto: payment.Monto,
        Email: user?.email
      });

      if (!res || !res.initPoint) {
        alert('Error al iniciar pago');
        return;
      }

      // Guardar el preferenceId o algo para verificar después si falla el redirect
      localStorage.setItem('last_payment_pref', res.preferenceId);

      // Redirigir a Mercado Pago en una nueva pestaña
      window.open(res.initPoint, '_blank');

    } catch (err) {
      console.error('Error al iniciar pago:', err);
      alert('Error al iniciar pago. Revisa la consola.');
    }
  }

  async verifyLastPayment() {
    this.checkingPayment.set(true);
    try {
      // Llamamos al backend para que busque activamente el pago en MP
      await this.servicesService.verifyPaymentStatus();
      
      // Recargamos la lista local
      await this.loadPayments();
      
      const current = this.currentPayment();
      if (current?.Pagado) {
        alert('¡Pago verificado con éxito!');
      } else {
        alert('El pago aún figura como pendiente. Si ya pagaste, espera unos instantes y vuelve a intentar.');
      }
    } catch (err) {
      console.error('Error verificando:', err);
      alert('Error al verificar el pago.');
    } finally {
      this.checkingPayment.set(false);
    }
  }

  private async checkForMercadoPagoReturn() {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('payment_id') || params.get('collection_id');

    console.log('Verificando retorno de MP. URL completa:', window.location.href);
    console.log('Payment ID encontrado:', paymentId);

    if (paymentId) {
      this.checkingPayment.set(true);
      
      try {
        console.log('Notificando pago al backend:', paymentId);
        // Notificar al backend sobre el pago
        await this.servicesService.notifyMercadoPago(paymentId);
        console.log('Pago notificado exitosamente');
        
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Recargar pagos
        await this.loadPayments();
      } catch (err) {
        console.error('Error verificando pago:', err);
      } finally {
        this.checkingPayment.set(false);
      }
    }
  }

  // Formateo de fecha
  formatDate(fecha?: string) {
    if (!fecha) return '';

    let date = new Date(fecha);

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
