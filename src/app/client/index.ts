import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export enum Role {
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN',
}

export interface User {
  id?: number;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  name?: string;
}

export interface Partner {
  id?: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  website?: string;
  status?: Partner.StatusEnum | string;
}

export namespace Partner {
  export enum StatusEnum {
    Waiting = 'WAITING',
    Validated = 'VALIDATED',
    Rejected = 'REJECTED',
  }
}

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  private http = inject(HttpClient);
  private basePath = '';

  setBasePath(path: string) {
    this.basePath = path;
  }

  addPartner(partner: Partner): Observable<Partner> {
    return this.http.post<Partner>(`${this.basePath}/partners`, partner);
  }
}

export function provideApi(config: {basePath?: string}) {
  return {
    provide: 'API_CONFIG',
    useFactory: (partnerService: PartnerService) => {
      if (config.basePath) {
        partnerService.setBasePath(config.basePath);
      }
      return partnerService;
    },
    deps: [PartnerService],
  };
}
