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

export interface ApiResponse {
  message: string;
}

export interface UpdateUserByAdminRequest {
  nombre: string;
  apellido: string;
  telefono?: string;
  email: string;
  contraseña?: string;      
  planId?: number | null;
  roleId: number;
}

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private API_URL = environment.apiUrl + '/admin/user';
  private http = inject(HttpClient);

  private getHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

   async createUser(data: CreateUserByAdminRequest): Promise<ApiResponse> {
    try {
      return await firstValueFrom(
        this.http.post<ApiResponse>(`${this.API_URL}`, data, { headers: this.getHeaders() })
      );
    } catch (error: any) {
      throw error.error?.message || 'Error al crear usuario';
    }
  }

   async updateUser(id: number, data: UpdateUserByAdminRequest): Promise<ApiResponse> {
    try {
      return await firstValueFrom(
        this.http.put<ApiResponse>(`${this.API_URL}/${id}`, data, { headers: this.getHeaders() })
      );
    } catch (error: any) {
      throw error.error?.message || 'Error al actualizar usuario';
    }
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    try {
      return await firstValueFrom(
        this.http.delete<ApiResponse>(`${this.API_URL}/${id}`, { headers: this.getHeaders() })
      );
    } catch (error: any) {
      throw error.error?.message || 'Error al eliminar usuario';
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      return await firstValueFrom(
        this.http.get<any[]>(`${this.API_URL}`, { headers: this.getHeaders() })
      );
    } catch (error: any) {
      throw error.error?.message || 'Error al obtener usuarios';
    }
  }




  // async createUser(data: CreateUserByAdminRequest): Promise<CreateUserResponse> {

  //   const token = localStorage.getItem('authToken');
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`
  //   });


  //   try {
  //     const response = await firstValueFrom(
  //       this.http.post<CreateUserResponse>(`${this.API_URL}`, data, { headers })
  //     );
  //     console.log('Usuario creado:', response.message);
  //     return response;
  //   } catch (error: any) {
  //     console.error('Admin create user error:', error);
  //     const serverErrorMessage =
  //       error.error?.message ||
  //       (error.error?.errors ? JSON.stringify(error.error.errors) : null) ||
  //       'Error al crear usuario. Intenta nuevamente.';
  //     throw serverErrorMessage;
  //   }
  // }


  
}