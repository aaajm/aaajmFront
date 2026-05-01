import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Partner} from '../models/partner';
import {API_CONFIG} from '../core/api-client';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  private http = inject(HttpClient);
  private config = inject(API_CONFIG, {optional: true});
  private apiUrl = this.config?.basePath || 'http://localhost:8081';

  addPartner(partner: Partner, logo?: File): Observable<Partner> {
    const formData = new FormData();
    formData.append(
      'partner',
      new Blob([JSON.stringify(partner)], {type: 'application/json'})
    );
    if (logo) {
      formData.append('logo', logo);
    }
    return this.http.post<Partner>(`${this.apiUrl}/partners`, formData);
  }
}
