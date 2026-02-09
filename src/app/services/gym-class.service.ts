import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreateGymClassRequest, GymClass } from '../shared/interfaces';

@Injectable({ providedIn: 'root' })
export class GymClassService {
  private http = inject(HttpClient);
  private API_URL = environment.apiUrl;

  private getHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllGymClasses(): Observable<GymClass[]> {
    return this.http.get<GymClass[]>(`${this.API_URL}/gymclass`, { headers: this.getHeaders() });
  }

  getGymClassById(id: number): Observable<GymClass> {
    return this.http.get<GymClass>(`${this.API_URL}/gymclass/${id}`, { headers: this.getHeaders() });
  }

  createGymClass(payload: CreateGymClassRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/gymclass`, payload, { headers: this.getHeaders() });
  }

  editGymClass(id: number, payload: Partial<CreateGymClassRequest>): Observable<any> {
    return this.http.put(`${this.API_URL}/gymclass/${id}`, payload, { headers: this.getHeaders() });
  }

  deleteGymClass(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/gymclass/${id}`, { headers: this.getHeaders() });
  }
}
