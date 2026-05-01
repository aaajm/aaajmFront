import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Topic} from '../models/topic';
import {API_CONFIG} from '../core/api-client';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private http = inject(HttpClient);
  private config = inject(API_CONFIG, {optional: true});
  private apiUrl = this.config?.basePath || 'http://localhost:8081';

  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.apiUrl}/topics`);
  }

  getOneTopic(id: string): Observable<Topic> {
    return this.http.get<Topic>(`${this.apiUrl}/topics/${id}`);
  }

  crupdateTopic(isUpdate: boolean, topic: any, files: File[]): Observable<Topic> {
    const formData = new FormData();
    formData.append('topic', new Blob([JSON.stringify(topic)], {type: 'application/json'}));
    files.forEach(file => formData.append('files', file));
    return this.http.post<Topic>(`${this.apiUrl}/topics`, formData);
  }
}
