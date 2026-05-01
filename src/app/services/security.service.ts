import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Whoami} from '../models/user';
import {API_CONFIG} from '../core/api-client';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private http = inject(HttpClient);
  private config = inject(API_CONFIG, {optional: true});
  private apiUrl = this.config?.basePath || 'http://localhost:8081';

  signin(signin: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/auth/signin`, signin);
  }

  resetPassword(email: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/auth/reset-password`, {email});
  }

  changePassword(payload: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/change-password`, payload);
  }

  emailVerification(code: string): Observable<Whoami> {
    return this.http.post<Whoami>(`${this.apiUrl}/auth/verify-email`, {code});
  }
}
