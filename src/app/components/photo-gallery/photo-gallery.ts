import {AuthProvider} from '@/app/providers';
import {ToastService} from '@/app/utils';
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
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.html',
  styleUrl: './photo-gallery.css',
})
export class PhotoGallery {
  fileService = inject(FileService);
  authProvider = inject(AuthProvider);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

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

  async deletePhoto(event: Event, photoId: string | undefined) {
    event.stopPropagation();
    if (!photoId || !this.authProvider.isAdmin()) return;
    if (!confirm('Voulez-vous vraiment supprimer cette photo ?')) return;
    try {
      await firstValueFrom(this.fileService.deleteFile(photoId));
      this.toast.message('success', 'Succès', 'Photo supprimée');
      this.orphansResource.reload();
      this.albumDetailsResource.reload();
      this.albumSummaryResource.reload();
      const remaining = this.viewerImages().filter((img) => img.id !== photoId);
      this.viewerImages.set(remaining);
      if (remaining.length === 0) {
        this.closeViewer();
      } else {
        this.currentIndex.set(
          Math.min(this.currentIndex(), remaining.length - 1)
        );
      }
    } catch (error) {
      console.error('Failed to delete photo', error);
    }
  }

  async deleteAlbum(event: Event, albumId: string | undefined) {
    event.stopPropagation();
    if (!albumId || !this.authProvider.isAdmin()) return;
    if (!confirm('Voulez-vous vraiment supprimer cet album et ses photos ?')) {
      return;
    }
    try {
      await firstValueFrom(this.fileService.removeCompleteAlbum(albumId, true));
      this.toast.message('success', 'Succès', 'Album supprimé');
      if (this.selectedAlbum()?.id === albumId) {
        this.selectedAlbum.set(null);
      }
      this.albumSummaryResource.reload();
      this.orphansResource.reload();
      this.closeViewer();
    } catch (error) {
      console.error('Failed to delete album', error);
    }
  }
}
