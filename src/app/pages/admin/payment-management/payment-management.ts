import { Component, inject, signal, Signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../services/payment.service';
import {  PaymentResponse } from '../../../shared/interfaces';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-payment-management',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './payment-management.html',
  styleUrl: './payment-management.scss',
})
export default class PaymentManagement implements OnInit {

 private paymentService = inject(PaymentService);
  payments: PaymentResponse[] = [];

  // Estado para el cargo manual
  manualCharge = {
    userId: 0,
    planId: 1,
    monto: 0
  };

  ngOnInit() {
    this.loadPayments();
    };


    loadPayments() {
    this.paymentService.getPayments().subscribe((res: PaymentResponse[]) => {
      this.payments = res;
    });
  }


  onSubmitManual() {
    if (this.manualCharge.userId <= 0 || this.manualCharge.monto <= 0) {
      alert('Por favor, completa los datos correctamente');
      return;
    }

    
    this.paymentService.createManualPayment(this.manualCharge).subscribe({
      next: (res) => {
        alert('Pago y suscripción cargados con éxito');
        this.loadPayments(); // Recargar la lista
        this.manualCharge = { userId: 0, planId: 1, monto: 0 }; // Reset
      },
      error: (err) => console.error('Error en cargo manual:', err)
    });
  }

  }


