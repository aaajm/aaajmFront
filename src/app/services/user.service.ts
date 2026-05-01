import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {API_CONFIG} from '../core/api-client';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private config = inject(API_CONFIG, {optional: true});
  private apiUrl = this.config?.basePath || 'http://localhost:8081';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}
