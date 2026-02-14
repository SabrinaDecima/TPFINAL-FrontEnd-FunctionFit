import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Importar Router
import { PlanService } from '../../services/plan.service';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';
import { PlanResponse, TypePlan } from '../../shared/interfaces';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagos.html'
})
export default class PagosComponent implements OnInit {
  private planService = inject(PlanService);
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  plans = signal<PlanResponse[]>([]);
  loading = signal(false);
  typePlan = TypePlan;
  subscription = signal<any>(null);

  esperandoConfirmacion = signal(false);

  ngOnInit() {
    this.loadPlans();
    this.checkPaymentStatus();
    this.checkCurrentSubscription();
  }

  checkCurrentSubscription() {
    try {
      const userId = this.authService.getUserId();
      
      // Si no hay ID válido, no hacemos la llamada HTTP
      if (userId === 0) {
        this.subscription.set(null);
        return;
      }
      
      this.paymentService.getActiveSubscription(userId).subscribe({
        next: (sub) => {
          console.log('Respuesta del servidor:', sub);
          // Si la suscripción existe y está activa (o vence en el futuro)
          if (sub && sub.isActive) {
            this.subscription.set(sub);
          }
        }
      });
    } catch (error) {
      console.error('Error al obtener ID del usuario:', error);
      this.subscription.set(null);
    }
  }

  loadPlans() {
    this.planService.getAllPlans().subscribe(res => this.plans.set(res));
  }

  checkPaymentStatus() {
    // Escuchamos los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      const paymentId = params['payment_id'];
      const status = params['status'];

      // Si el pago fue aprobado y tenemos el ID, confirmamos con el backend
      if (status === 'approved' && paymentId) {
        this.confirmarPagoEnServidor(paymentId);
      } else if (status === 'failure') {
        alert('El pago fue rechazado. Por favor, intenta nuevamente.');
      }
    });
  }

  confirmarPagoEnServidor(paymentId: string) {
   
    if (!paymentId) return alert('Por favor, ingresa el número de operación');

    this.loading.set(true);
    this.paymentService.confirmarPago(paymentId).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.esperandoConfirmacion.set(false); // Ocultamos el cuadro
        this.checkCurrentSubscription(); // Refrescar el estado de la suscripción
        alert('¡Pago confirmado exitosamente!');
        this.router.navigate(['/home-socio']);
      },
      error: (err) => {
        this.loading.set(false);
        alert('No se pudo validar el pago. Verifica el número e intenta de nuevo.');
      }
    });
  }

  buyPlan(planId: number) {
    this.loading.set(true);
    this.paymentService.createPreference(planId).subscribe({
      next: (res) => {
        this.loading.set(false);
        window.open(res.initPoint, '_blank');
        this.esperandoConfirmacion.set(true); 
      },
      error: () => this.loading.set(false)
    });
  }

  getPlanDetails(tipo: TypePlan) {
    const details = {
      [TypePlan.Basic]: { icon: '🚀', desc: '5 clases mensuales' },
      [TypePlan.Premium]: { icon: '⭐', desc: '10 clases mensuales' },
      [TypePlan.Elite]: { icon: '👑', desc: 'Clases ilimitadas' }
    };
    return details[tipo];
  }
}