import {Component, inject, OnInit, computed, signal} from '@angular/core';
import {AlbumService, HttpStateService} from '@/app/services';
import {Album} from '@/app/models/album';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.html',
  styleUrl: './photo-gallery.css',
})
export class PhotoGallery implements OnInit {
  private albumService = inject(AlbumService);
  
  // Gestion d'état pour la récupération des albums depuis le backend
  albumState = inject(HttpStateService<Album[]>);

  activeTab = 'vos-photos';
  selectedAlbum = signal<Album | null>(null);

  tabs = [
    { id: 'vos-photos', label: "Photos" },
    { id: 'albums', label: 'Albums' },
    { id: 'tagged', label: 'Identifications' },
  ];

  // Accès direct aux données du serveur
  allAlbums = computed(() => {
    return this.albumState.data() || [];
  });

  // Calculer toutes les photos à partir des albums du backend
  allPhotos = computed(() => {
    const albums = this.allAlbums();
    return albums.flatMap(album => 
      album.medias?.map(media => ({
        url: media.file_url,
        alt: album.title,
        albumTitle: album.title
      })) || []
    );
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.albumState.request({
      request: this.albumService.getAlbums(''), // On récupère tous les albums (titre vide)
    });
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
    this.selectedAlbum.set(null);
  }

  selectAlbum(album: Album) {
    this.selectedAlbum.set(album);
  }

  backToAlbums() {
    this.selectedAlbum.set(null);
  }
}
