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

  ngOnInit() {
    this.paymentService.getPayments().subscribe((res: PaymentResponse[]) => {
      this.payments = res;
    });
  }

}
