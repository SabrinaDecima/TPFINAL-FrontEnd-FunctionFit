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
        return this.http.get<PaymentResponse[]>(`${this.API_URL}/payment`, { headers: this.getHeaders() });
      }
}