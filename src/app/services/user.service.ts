import { Injectable, signal, inject } from '@angular/core';
import { User } from '../shared/interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
 
  private API_URL = environment.apiUrl 
  private usersSignal = signal<User[]>([]);
  public users = this.usersSignal.asReadonly();

  private http= inject(HttpClient);
  

  async loadUsers(): Promise<User[]> {
    try {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const data = await firstValueFrom(this.http.get<User[]>(`${this.API_URL}/User`, { headers }));
      this.usersSignal.set(data);
      return data;
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      return [];
    }
  }
}
