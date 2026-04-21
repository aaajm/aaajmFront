import {Actualite, Commentaire, Event, Member} from '@/app/models';
import {ApiService} from '@/app/services';
import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  actualites: Actualite[] = [];
  events: Event[] = [];
  searchKeyword: string = '';
  searchResults: {membres: Member[]; actualites: Actualite[]} = {
    membres: [],
    actualites: [],
  };
  showSearchResults: boolean = false;
  currentDate: Date = new Date();

  // Pour les commentaires
  commentTexts: {[key: number]: string} = {};
  showCommentForm: {[key: number]: boolean} = {};

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadActualites();
    this.loadEvents();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  loadActualites() {
    this.apiService.getActualites().subscribe({
      next: (data) => {
        this.actualites = data;
      },
      error: (error) => {
        console.error('Error loading actualites:', error);
        // Données mockées pour le développement
        this.actualites = this.getMockActualites();
      },
    });
  }

  loadEvents() {
    this.apiService.getUpcomingEvents().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        // Données mockées pour le développement
        this.events = this.getMockEvents();
      },
    });
  }

  onSearch() {
    if (this.searchKeyword.trim()) {
      this.apiService.searchMembres(this.searchKeyword).subscribe({
        next: (membres) => {
          this.searchResults.membres = membres;
        },
        error: (error) => {
          console.error('Error searching membres:', error);
          this.searchResults.membres = this.getMockMembres();
        },
      });

      this.apiService.searchActualites(this.searchKeyword).subscribe({
        next: (actualites) => {
          this.searchResults.actualites = actualites;
          this.showSearchResults = true;
        },
        error: (error) => {
          console.error('Error searching actualites:', error);
          this.searchResults.actualites = this.actualites;
          this.showSearchResults = true;
        },
      });
    } else {
      this.showSearchResults = false;
      this.searchResults = {membres: [], actualites: []};
    }
  }

  closeSearchResults() {
    this.showSearchResults = false;
    this.searchKeyword = '';
    this.searchResults = {membres: [], actualites: []};
  }

  shareActualite(actualite: Actualite) {
    const url = `${window.location.origin}/#actualite-${actualite.id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('Lien copié dans le presse-papier !');
      })
      .catch(() => {
        alert('Partagez ce lien : ' + url);
      });
  }

  addCommentaire(actualiteId: number) {
    if (!this.commentTexts[actualiteId]?.trim()) return;

    const commentaire: Commentaire = {
      actualiteId: actualiteId,
      contenu: this.commentTexts[actualiteId],
      date: new Date(),
      estReponseAdmin: false,
    };

    this.apiService.addCommentaire(commentaire).subscribe({
      next: () => {
        this.commentTexts[actualiteId] = '';
        this.showCommentForm[actualiteId] = false;
        this.loadActualites(); // Recharger les actualités
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        alert("Erreur lors de l'ajout du commentaire");
      },
    });
  }

  getReactionCount(actualite: Actualite, type: string): number {
    if (!actualite.reactions) return 0;
    return actualite.reactions.filter((r) => r.type === type).length;
  }

  // Données mockées pour le développement
  private getMockActualites(): Actualite[] {
    return [
      {
        id: 1,
        titre: 'Grande collecte de fonds',
        description:
          'Notre association organise une grande collecte de fonds pour soutenir les enfants défavorisés. Rejoignez-nous dans cette noble cause !',
        date: new Date(),
        commentaires: [
          {
            id: 1,
            actualiteId: 1,
            contenu: 'Très belle initiative !',
            date: new Date(),
            estReponseAdmin: false,
          },
        ],
        reactions: [
          {
            id: 1,
            actualiteId: 1,
            fingerprint: 'xxx',
            type: 'like',
            date: new Date(),
          },
        ],
      },
      {
        id: 2,
        titre: 'Atelier de formation',
        description:
          'Atelier gratuit sur le développement personnel et professionnel. Inscrivez-vous rapidement !',
        date: new Date(),
        commentaires: [],
        reactions: [],
      },
    ];
  }

  private getMockEvents(): Event[] {
    return [
      {
        id: 1,
        titre: 'Assemblée générale',
        description: 'Réunion annuelle des membres',
        date: new Date(2026, 4, 25),
        lieu: 'Salle de conférence',
        couleur: '#3498db',
      },
      {
        id: 2,
        titre: 'Gala de charité',
        description: 'Soirée de collecte de fonds',
        date: new Date(2026, 5, 10),
        lieu: 'Hôtel Carlton',
        couleur: '#e74c3c',
      },
    ];
  }

  private getMockMembres(): Member[] {
    return [
      {
        id: 1,
        nom: 'Martin',
        prenom: 'Jean',
        adresse: 'Antananarivo',
        telephone: '0321234567',
        poste: 'Président',
        email: 'jean.martin@email.com',
      },
      {
        id: 2,
        nom: 'Rakoto',
        prenom: 'Marie',
        adresse: 'Antananarivo',
        telephone: '0327654321',
        poste: 'Secrétaire',
        email: 'marie.rakoto@email.com',
      },
    ];
  }
}
