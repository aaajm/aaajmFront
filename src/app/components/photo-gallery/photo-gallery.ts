import {Album, AlbumSummary, FileInfo, FileService} from '@aaajm/client';
import {Component, computed, inject, resource, signal} from '@angular/core';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-photo-gallery',
  imports: [],
  templateUrl: './photo-gallery.html',
  styleUrl: './photo-gallery.css',
})
export class PhotoGallery {
  fileService = inject(FileService);
  files = signal<FileInfo[]>([]);
  /**todo: miandry ilay ressource any @ back */

  albumResource = resource({
    loader: ({params}): Promise<AlbumSummary[]> => {
      return firstValueFrom(this.fileService.getAlbumSummary(''));
    },
  });

  albums = computed(() => {
    if (this.albumResource.hasValue()) {
      return this.albumResource.value();
    }

    return [];
  });

  albumDetailsResource = resource({
    params: () => ({id: this.selectedAlbum()?.id}),
    loader: ({params}): Promise<Album> => {
      return firstValueFrom(this.fileService.getOneAlbum(params.id || ''));
    },
  });

  albumsDetails = computed(() => {
    if (this.albumDetailsResource.hasValue()) {
      return this.albumDetailsResource.value();
    }

    return null;
  });

  activeTab = 'vos-photos';
  selectedAlbum = signal<AlbumSummary | null>(null);

  tabs = [
    {id: 'vos-photos', label: 'Photos'},
    {id: 'albums', label: 'Albums'},
    {id: 'tagged', label: 'Identifications'},
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
}
