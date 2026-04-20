import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member, Partenaire, Actualite, Commentaire, Reaction, Event, PartenaireExterne, Photo } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Membres
  getMembres(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/membres`);
  }

  getMembre(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/membres/${id}`);
  }

  searchMembres(keyword: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/membres/search?keyword=${keyword}`);
  }

  // Partenaires (adhésion)
  addPartenaire(partenaire: Partenaire): Observable<Partenaire> {
    return this.http.post<Partenaire>(`${this.apiUrl}/partenaires`, partenaire);
  }

  // Partenaires externes (affichage)
  getPartenairesExternes(): Observable<PartenaireExterne[]> {
    return this.http.get<PartenaireExterne[]>(`${this.apiUrl}/partenaires-externes`);
  }

  // Actualités
  getActualites(): Observable<Actualite[]> {
    return this.http.get<Actualite[]>(`${this.apiUrl}/actualites`);
  }

  getActualite(id: number): Observable<Actualite> {
    return this.http.get<Actualite>(`${this.apiUrl}/actualites/${id}`);
  }

  searchActualites(keyword: string): Observable<Actualite[]> {
    return this.http.get<Actualite[]>(`${this.apiUrl}/actualites/search?keyword=${keyword}`);
  }

  addCommentaire(commentaire: Commentaire): Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.apiUrl}/commentaires`, commentaire);
  }

  addReponseAdmin(commentaireId: number, reponse: string): Observable<Commentaire> {
    return this.http.put<Commentaire>(`${this.apiUrl}/commentaires/${commentaireId}/reponse`, { reponse });
  }

  addReaction(reaction: Reaction): Observable<Reaction> {
    return this.http.post<Reaction>(`${this.apiUrl}/reactions`, reaction);
  }

  checkReactionExists(actualiteId: number, fingerprint: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/reactions/exists`, {
      params: { actualiteId: actualiteId.toString(), fingerprint: fingerprint }
    });
  }

  getReactionCounts(actualiteId: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/reactions/counts/${actualiteId}`);
  }

  // Événements
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events`);
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events/upcoming`);
  }

  // Photos
  getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.apiUrl}/photos`);
  }

  getPhotosByCategorie(categorie: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.apiUrl}/photos/categorie/${categorie}`);
  }
}