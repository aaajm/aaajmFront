import { Album, AlbumSummary, FileInfo, FileService } from '@aaajm/client';
import { Component, computed, HostListener, inject, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.html',
  styleUrl: './photo-gallery.css',
})
export class PhotoGallery {
  fileService = inject(FileService);

  // 1. Load light summaries for the list (RAM optimization)
  albumSummaryResource = resource({
    loader: () => firstValueFrom(this.fileService.getAlbumSummary('')),
  });

  albums = computed(() => {
    if (this.albumSummaryResource.hasValue()) {
      return this.albumSummaryResource.value();
    }
    return [];
  });

  // 2. Load full details only for the selected album
  selectedAlbum = signal<AlbumSummary | null>(null);

  albumDetailsResource = resource({
    params: () => ({ id: this.selectedAlbum()?.id }),
    loader: ({ params }): Promise<Album | null> => {
      if (!params.id) return Promise.resolve(null);
      return firstValueFrom(this.fileService.getOneAlbum(params.id));
    },
  });

  albumsDetails = computed(() => {
    if (this.albumDetailsResource.hasValue()) {
      return this.albumDetailsResource.value();
    }
    return null;
  });

  // For the "Photos" tab (all photos), we still need full data if we want to show everything.
  // To keep it simple for now, we'll fetch them separately or keep them empty if memory is a concern.
  allAlbumsResource = resource({
    loader: () => firstValueFrom(this.fileService.getAlbums('')),
  });

  files = computed(() => {
    if (this.allAlbumsResource.hasValue()) {
      return this.allAlbumsResource.value().flatMap(album => album.medias || []);
    }
    return [];
  });

  activeTab = 'vos-photos';

  tabs = [
    { id: 'vos-photos', label: 'Photos' },
    { id: 'albums', label: 'Albums' },
  ];

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
    this.selectedAlbum.set(null);
  }

  selectAlbum(album: AlbumSummary) {
    this.selectedAlbum.set(album);
  }

  backToAlbums() {
    this.selectedAlbum.set(null);
  }

  // Viewer state
  viewerVisible = signal(false);
  viewerImages = signal<FileInfo[]>([]);
  currentIndex = signal(0);

  openViewer(images: FileInfo[], startAt: number = 0) {
    this.viewerImages.set(images);
    this.currentIndex.set(startAt);
    this.viewerVisible.set(true);
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
  }

  closeViewer() {
    this.viewerVisible.set(false);
    document.body.style.overflow = 'auto';
  }

  nextImage(event?: Event) {
    if (event) event.stopPropagation();
    if (this.viewerImages().length === 0) return;
    const next = (this.currentIndex() + 1) % this.viewerImages().length;
    this.currentIndex.set(next);
  }

  prevImage(event?: Event) {
    if (event) event.stopPropagation();
    if (this.viewerImages().length === 0) return;
    const prev = (this.currentIndex() - 1 + this.viewerImages().length) % this.viewerImages().length;
    this.currentIndex.set(prev);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.viewerVisible()) return;
    
    if (event.key === 'Escape') this.closeViewer();
    if (event.key === 'ArrowRight') this.nextImage();
    if (event.key === 'ArrowLeft') this.prevImage();
  }

  async openAlbumInViewer(event: Event, albumId: string) {
    event.stopPropagation();
    try {
      const album = await firstValueFrom(this.fileService.getOneAlbum(albumId));
      if (album && album.medias && album.medias.length > 0) {
        this.openViewer(album.medias, 0);
      }
    } catch (error) {
      console.error('Erreur ouverture viewer album:', error);
    }
  }
}
