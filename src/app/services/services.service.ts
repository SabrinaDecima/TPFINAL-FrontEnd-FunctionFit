import { inject, Injectable, signal } from '@angular/core';
import { User } from '../shared/interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GymClass } from '../shared/interfaces/gym-class.interface';
import { EnrollmentResponse } from '../shared/interfaces/enrollment-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private API_URL = 'https://localhost:7150';
  private http = inject(HttpClient);

  _currentUser = signal<User | null>(null);
  _pageTitle = signal<string>('Angular 20');
  private _isAuthenticated = signal(false);

  constructor() {
    const saved = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');
    if (saved && token) {
      try {
        const user = JSON.parse(saved);
        if (['Socio', 'Administrador', 'SuperAdministrador'].includes(user.role)) {
          this._currentUser.set(user);
          this._isAuthenticated.set(true);
          this._pageTitle.set(`Bienvenido, ${user.name}`);
        } else {
          this.logout();
        }
      } catch (e) {
        console.warn('Invalid user in localStorage');
        this.logout();
      }
    }
  }

  setPageTitle(title: string): void {
    this._pageTitle.set(title);
  }

  isAuthenticated() {
    return this._isAuthenticated();
  }

  async login(email: string, password: string): Promise<boolean> {
    const url = `${this.API_URL}/api/Auth/login`;
    const body = { email, password };

    try {
      const res = await firstValueFrom(
        this.http.post<{
          token: string;
          email: string;
          role: 'Socio' | 'Administrador' | 'SuperAdministrador';
          userId: number;
          name: string;
        }>(url, body)
      );

      const user: User = {
        id: res.userId.toString(),
        name: res.name,
        email: res.email,
        role: res.role
      };

      localStorage.setItem('authToken', res.token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      this._currentUser.set(user);
      this._isAuthenticated.set(true);
      this._pageTitle.set(`Bienvenido, ${user.name}`);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  logout(): void {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this._pageTitle.set('Angular 20');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  async getGymClasses(): Promise<GymClass[]> {
    const token = this.getAuthToken();
    if (!token) throw new Error('No auth token');

    const url = `${this.API_URL}/api/GymClass`;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const response = await firstValueFrom(
      this.http.get<GymClass[]>(url, { headers })
    );
    return response;
  }

  async reserveClass(classId: number): Promise<EnrollmentResponse> {
    const token = this.getAuthToken();
    const user = this._currentUser();
    if (!token || !user) throw new Error('Usuario no autenticado');

    const url = `${this.API_URL}/api/Enrollment/enroll`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const body = { userId: Number(user.id), gymClassId: classId };

    return firstValueFrom(this.http.post<EnrollmentResponse>(url, body, { headers }));
  }

  async cancelReservation(classId: number): Promise<EnrollmentResponse> {
    const token = this.getAuthToken();
    const user = this._currentUser();
    if (!token || !user) throw new Error('Usuario no autenticado');

    const url = `${this.API_URL}/api/Enrollment/unenroll`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const body = { userId: Number(user.id), gymClassId: classId };

    return firstValueFrom(
      this.http.request<EnrollmentResponse>('delete', url, { body, headers })
    );
  }


}