import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Photo} from '../models/models';
import {API_CONFIG} from '../core/api-client';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private http = inject(HttpClient);
  private config = inject(API_CONFIG, {optional: true});
  private apiUrl = this.config?.basePath || 'http://localhost:8081';

  addPhoto(photo: Photo, image?: File): Observable<Photo> {
    const formData = new FormData();
    formData.append(
      'photo',
      new Blob([JSON.stringify(photo)], {type: 'application/json'})
    );
    if (image) {
      formData.append('image', image);
    }
    return this.http.post<Photo>(`${this.apiUrl}/photos`, formData);
  }

  getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.apiUrl}/photos`);
  }
}
