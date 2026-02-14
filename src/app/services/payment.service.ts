import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PaymentResponse } from '../shared/interfaces';

@Injectable({ providedIn: 'root' })
export class PaymentService {
    private http = inject(HttpClient);
    private API_URL = environment.apiUrl

    private getHeaders() {
        const token = localStorage.getItem('authToken');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }

    getPayments(): Observable<PaymentResponse[]> {
        return this.http.get<PaymentResponse[]>(`${this.API_URL}/Payment`, { headers: this.getHeaders() });
    }

    createManualPayment(data: any): Observable<any> {

        return this.http.post(`${this.API_URL}/Payment/manual`, data, { headers: this.getHeaders() });
    }

    confirmarPago(paymentId: string): Observable<any> {
        // Usamos params porque el Controller en C# lo esperará via [FromQuery]
        return this.http.get(`${this.API_URL}/Payment/confirm`, {
            headers: this.getHeaders(),
            params: { paymentId: paymentId }
        });
    }

    getActiveSubscription(userId: number): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/Payment/active/${userId}`, { headers: this.getHeaders() });
    }

    createPreference(planId: number): Observable<{ initPoint: string }> {
        // Enviamos un objeto con el planId. El backend debería extraer el UserId del Token JWT
        return this.http.post<{ initPoint: string }>(
            `${this.API_URL}/Payment/mercadopago`,
            { planId },
            { headers: this.getHeaders() }
        );
    }

}

