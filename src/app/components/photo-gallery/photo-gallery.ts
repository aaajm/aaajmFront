import {Album, AlbumSummary, FileInfo, FileService} from '@aaajm/client';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {
  Component,
  computed,
  HostListener,
  inject,
  resource,
  signal,
} from '@angular/core';
import {ImageModule} from 'primeng/image';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, ImageModule],
  templateUrl: './photo-gallery.html',
  styleUrl: './photo-gallery.css',
})
export class PhotoGallery {
  fileService = inject(FileService);
  private http = inject(HttpClient);

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
    params: () => ({id: this.selectedAlbum()?.id}),
    loader: ({params}): Promise<Album | null> => {
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

  orphansResource = resource({
    loader: (): Promise<FileInfo[]> =>
      firstValueFrom(
        this.http.get<FileInfo[]>(
          `${import.meta.env.NG_APP_API_URL}/files/orphans`
        )
      ).catch(() => []),
  });

  orphanPhotos = computed(() => this.orphansResource.value() ?? []);

  activeTab = 'vos-photos';

  tabs = [
    {id: 'vos-photos', label: 'Photos'},
    {id: 'albums', label: 'Albums'},
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
  rotation = signal(0);
  zoom = signal(1);

  openViewer(images: FileInfo[], startAt: number = 0) {
    this.viewerImages.set(images);
    this.currentIndex.set(startAt);
    this.resetTransform();
    this.viewerVisible.set(true);
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
  }

  closeViewer() {
    this.viewerVisible.set(false);
    document.body.style.overflow = 'auto';
    this.resetTransform();
  }

  nextImage(event?: Event) {
    if (event) event.stopPropagation();
    if (this.viewerImages().length === 0) return;
    const next = (this.currentIndex() + 1) % this.viewerImages().length;
    this.currentIndex.set(next);
    this.resetTransform();
  }

  prevImage(event?: Event) {
    if (event) event.stopPropagation();
    if (this.viewerImages().length === 0) return;
    const prev =
      (this.currentIndex() - 1 + this.viewerImages().length) %
      this.viewerImages().length;
    this.currentIndex.set(prev);
    this.resetTransform();
  }

  rotateLeft() {
    this.rotation.update((r) => r - 90);
  }

  rotateRight() {
    this.rotation.update((r) => r + 90);
  }

  zoomIn() {
    this.zoom.update((z) => Math.min(z + 0.2, 3));
  }

  zoomOut() {
    this.zoom.update((z) => Math.max(z - 0.2, 0.5));
  }

  resetTransform() {
    this.rotation.set(0);
    this.zoom.set(1);
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
