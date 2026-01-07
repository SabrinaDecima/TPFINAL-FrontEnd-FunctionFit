// src/app/services/services.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../shared/interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private API_URL = 'https://jsonplaceholder.typicode.com';
  private http = inject(HttpClient);

  _currentUser = signal<User | null>(null);
  _pageTitle = signal<string>('Angular 20');
  private _isAuthenticated = signal(false);

  constructor() {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        this._currentUser.set(user);
        this._isAuthenticated.set(true);
        this._pageTitle.set(`Bienvenido, ${user.name}`);
      } catch (e) {
        console.warn('Invalid user in localStorage');
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
    if (password !== '1234') return false;

    const users: User[] = [
      { id: 1, name: 'cliente', email: 'cliente@demo.com', role: 'Socio' },
      { id: 2, name: 'admin', email: 'admin@demo.com', role: 'Administrador' },
      { id: 3, name: 'superadmin', email: 'superadmin@demo.com', role: 'SuperAdministrador' }
    ];

    const user = users.find(u => u.email === email);
    if (!user) return false;

    this._currentUser.set(user);
    this._isAuthenticated.set(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this._pageTitle.set(`Bienvenido, ${user.name}`);
    return true;
  }

  logout(): void {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this._pageTitle.set('Angular 20');
    localStorage.removeItem('currentUser');
  }
}