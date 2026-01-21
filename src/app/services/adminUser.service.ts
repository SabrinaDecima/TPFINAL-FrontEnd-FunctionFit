import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface CreateUserByAdminRequest {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  contraseña: string;
  planId?: number | null;
  roleId: number;
}

export interface CreateUserResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private API_URL = environment.apiUrl + '/user';
  private http = inject(HttpClient);

  async createUser(data: CreateUserByAdminRequest): Promise<CreateUserResponse> {

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });


    try {
      const response = await firstValueFrom(
        this.http.post<CreateUserResponse>(`${this.API_URL}`, data, { headers })
      );
      console.log('Usuario creado:', response.message);
      return response;
    } catch (error: any) {
      console.error('Admin create user error:', error);
      const serverErrorMessage =
        error.error?.message ||
        (error.error?.errors ? JSON.stringify(error.error.errors) : null) ||
        'Error al crear usuario. Intenta nuevamente.';
      throw serverErrorMessage;
    }
  }
}