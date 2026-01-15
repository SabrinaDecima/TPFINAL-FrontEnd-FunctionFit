import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private API_URL = environment.apiUrl + '/Auth';
    private http = inject(HttpClient);
    
    async forgotPassword(email: string) {
        return firstValueFrom(
        this.http.post(`${this.API_URL}/forgot-password`, { email })
  );

    }

    async resetPassword(data: { token: string | null; newPassword: string }) {
        return firstValueFrom(
        this.http.post(`${this.API_URL}/reset-password`, data)
  );
}
}