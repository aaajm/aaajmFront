import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Album, AlbumSummary, CreateAlbum} from '../models/album';
import {API_CONFIG} from '../core/api-client';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private http = inject(HttpClient);
  
  // Injection du Token de configuration API
  private config = inject(API_CONFIG, {optional: true});
  private apiUrl = this.config?.basePath || 'http://localhost:8081';

  getAlbums(title: string = ''): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.apiUrl}/albums`, {
      params: {title},
    });
  }

  addMediaToAlbum(album: CreateAlbum, images: File[]): Observable<Album> {
    const formData = new FormData();
    formData.append(
      'album',
      new Blob([JSON.stringify(album)], {type: 'application/json'})
    );
    images.forEach((image) => {
      formData.append('images', image);
    });
    return this.http.put<Album>(`${this.apiUrl}/albums`, formData);
  }

  getAlbumSummary(title: string = ''): Observable<AlbumSummary[]> {
    return this.http.get<AlbumSummary[]>(`${this.apiUrl}/albums/summary`, {
      params: {title},
    });
  }

  deleteFile(fileId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/files/${fileId}`);
  }

  removeCompleteAlbum(albumId: string, deleteImage: boolean = false): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/albums/${albumId}`, {
      params: {deleteImage: deleteImage.toString()},
    });
  }
}
