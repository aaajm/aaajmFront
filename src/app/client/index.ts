import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export enum Role {
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN',
}

export interface User {
  id?: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  name?: string;
  firstname?: string;
  lastname?: string;
  profile?: string;
  postOffice?: string;
  phone?: string;
}

export interface Partner {
  id?: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  website?: string;
  status?: Partner.StatusEnum | string;
  address?: string;
}

export namespace Partner {
  export enum StatusEnum {
    Waiting = 'WAITING',
    Validated = 'VALIDATED',
    Rejected = 'REJECTED',
  }
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  creationDatetime: string;
  createdBy: User;
  images: {file_url: string}[];
}

export interface CreateTopic {
  title: string;
  description: string;
  authorId: string;
}

export interface Signin {
  email?: string;
  password?: string;
}

export interface ChangePassword {
  newPassword?: string;
  confirmPassword?: string;
  otpCode?: string;
}

export interface Whoami {
  bearer?: string;
  user?: User;
}

// Album Interfaces
export interface FileInfo {
  id: string;
  file_url: string;
}

export type Author = User;

export interface Album {
  id: string;
  title: string;
  creationDatetime: string;
  medias: FileInfo[];
  createdBy: Author;
}

export interface CreateAlbum {
  id: string;
  title: string;
  authorId: string;
}

export interface AlbumSummary {
  id: string;
  title: string;
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

  addPartner(partner: Partner, logo?: File): Observable<Partner> {
    const formData = new FormData();
    formData.append('partner', JSON.stringify(partner));
    if (logo) {
      formData.append('logo', logo);
    }
    return this.http.post<Partner>(`${this.basePath}/partners`, formData);
  }
}

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private http = inject(HttpClient);
  private basePath = '';

  setBasePath(path: string) {
    this.basePath = path;
  }

  crupdateTopic(
    isUpdate: boolean,
    data: CreateTopic,
    files: File[]
  ): Observable<Topic> {
    const formData = new FormData();
    formData.append('topic', JSON.stringify(data));
    files.forEach((file) => formData.append('files', file));

    if (isUpdate) {
      return this.http.put<Topic>(`${this.basePath}/topics`, formData);
    }
    return this.http.post<Topic>(`${this.basePath}/topics`, formData);
  }

  getOneTopic(id: string): Observable<Topic> {
    return this.http.get<Topic>(`${this.basePath}/topics/${id}`);
  }

  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.basePath}/topics`);
  }
}

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private http = inject(HttpClient);
  private basePath = '';

  setBasePath(path: string) {
    this.basePath = path;
  }

  signin(data: Signin): Observable<string> {
    return this.http.post<string>(`${this.basePath}/security/signin`, data);
  }

  resetPassword(email: string): Observable<string> {
    return this.http.post<string>(`${this.basePath}/security/reset-password`, {
      email,
    });
  }

  changePassword(data: ChangePassword): Observable<void> {
    return this.http.post<void>(
      `${this.basePath}/security/change-password`,
      data
    );
  }

  emailVerification(code: string): Observable<Whoami> {
    return this.http.post<Whoami>(
      `${this.basePath}/security/verify-email`,
      {code}
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private basePath = '';

  setBasePath(path: string) {
    this.basePath = path;
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.basePath}/users`);
  }
}

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private http = inject(HttpClient);
  private basePath = '';

  setBasePath(path: string) {
    this.basePath = path;
  }

  getAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.basePath}/albums`);
  }

  getOneAlbum(id: string): Observable<Album> {
    return this.http.get<Album>(`${this.basePath}/albums/${id}`);
  }

  createAlbum(album: CreateAlbum): Observable<Album> {
    return this.http.post<Album>(`${this.basePath}/albums`, album);
  }
}

export function provideApi(config: {
  basePath?: string;
  credentials?: Record<string, () => string | undefined>;
}) {
  return [
    {
      provide: 'API_CONFIG',
      useFactory: (
        partnerService: PartnerService,
        topicService: TopicService,
        securityService: SecurityService,
        userService: UserService,
        albumService: AlbumService
      ) => {
        if (config.basePath) {
          partnerService.setBasePath(config.basePath);
          topicService.setBasePath(config.basePath);
          securityService.setBasePath(config.basePath);
          userService.setBasePath(config.basePath);
          albumService.setBasePath(config.basePath);
        }
        return config;
      },
      deps: [
        PartnerService,
        TopicService,
        SecurityService,
        UserService,
        AlbumService
      ],
    },
  ];
}
