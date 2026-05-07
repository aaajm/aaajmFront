import {AuthProvider} from '@/app/providers';
import {HttpStateService} from '@/app/services';
import {DEFAULT_ALBUM, newId, ToastService} from '@/app/utils';
import {
  Album,
  AlbumSummary,
  CreateAlbum,
  FileInfo,
  FileService,
} from '@aaajm/client';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
  resource,
  signal,
  ViewChild,
} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {ButtonDirective} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {Image, ImageModule} from 'primeng/image';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputTextModule} from 'primeng/inputtext';
import {TabsModule} from 'primeng/tabs';
import {firstValueFrom, from} from 'rxjs';
import {Fileupload} from '../file-upload';
import {Skeleton} from '../skeleton';

@Component({
  selector: 'photo-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputGroupModule,
    ConfirmDialogModule,
    Fileupload,
    ImageModule,
    TabsModule,
    ButtonDirective,
    Skeleton,
  ],
  providers: [ConfirmationService],
  templateUrl: './photo-form.html',
})
export class PhotoForm implements OnInit {
  @ViewChild('idImage') idImage: Image | null = null;
  @ViewChild('pFileUpload') fileComponent: Fileupload | null = null;
  private formBuilder = inject(FormBuilder);
  private fileService = inject(FileService);
  private authProvider = inject(AuthProvider);
  private confirmationService = inject(ConfirmationService);
  private http = inject(HttpClient);
  toast = inject(ToastService);
  submitPhotoState = inject(HttpStateService);

  selectedTab = signal('new');

  tabMenu = [
    {label: 'Nouvel album', value: 'new', icon: 'pi pi-plus'},
    {label: 'Album existant', value: 'existing', icon: 'pi pi-folder'},
  ];

  // Data
  albumsResource = resource({
    loader: (): Promise<AlbumSummary[]> =>
      firstValueFrom(this.fileService.getAlbumSummary('')).catch(() => []),
  });

  albums = computed(() => this.albumsResource.value() || []);

  // Détails de l'album sélectionné (pour gérer les photos)
  selectedAlbumId = signal<string | null>(null);
  selectedAlbumDetailsResource = resource({
    params: () => ({id: this.selectedAlbumId()}),
    loader: async ({params}): Promise<Album | null> => {
      if (!params.id) return null;
      const album = await firstValueFrom(
        this.fileService.getOneAlbum(params.id)
      );

      return album;
    },
  });

  selectedAlbumDetails = computed(() =>
    this.selectedAlbumDetailsResource.value()
  );

  imageFiles = signal<File[]>([]);

  // États pour la modification d'album
  editingAlbumId = signal<string | null>(null);
  editingTitle = signal<string>('');

  // Photos sans album (ex: publications)
  orphansResource = resource({
    loader: (): Promise<FileInfo[]> =>
      firstValueFrom(
        this.http.get<FileInfo[]>(
          `${import.meta.env.NG_APP_API_URL}/files/orphans`
        )
      ).catch(() => []),
  });

  orphanPhotos = computed(() => this.orphansResource.value() ?? []);
  selectedOrphans = signal<string[]>([]);

  photoForm = this.formBuilder.group(
    DEFAULT_ALBUM(this.authProvider.currentUser()?.id)
  );
  triggerPreview() {
    const el = this.idImage?.$el;
    if (el) {
      // On cherche le bouton d'aperçu ou l'image qui porte l'action
      const trigger = el.querySelector('.p-image-preview-indicator, img');
      trigger?.click();
    }
  }

  canSubmit = computed(() => {
    const isNew = this.selectedTab() == 'new';
    const titleValid = isNew
      ? (this.photoForm.get('title')?.valid ?? false)
      : true;
    const albumSelected = isNew ? true : this.selectedAlbumId();
    const hasImage = this.imageFiles().length > 0;
    const hasOrphans = this.selectedOrphans().length > 0;

    return titleValid && albumSelected && (hasImage || hasOrphans);
  });

  selectedAlbum = computed(() => {
    const id = this.photoForm.get('selectedAlbumId')?.value;
    return this.albums().find((a) => a.id === id) || null;
  });

  toggleOrphanSelection(photoId: string | undefined) {
    if (!photoId) return;
    const current = this.selectedOrphans();
    if (current.includes(photoId)) {
      this.selectedOrphans.set(current.filter((id) => id !== photoId));
    } else {
      this.selectedOrphans.set([...current, photoId]);
    }
  }

  ngOnInit() {
    this.resetForm();
  }

  selectAlbum(albumId: string) {
    if (this.editingAlbumId()) return;
    this.selectedAlbumId.set(albumId);
  }

  confirmDeleteFile(event: Event, fileId: string) {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Voulez-vous vraiment supprimer cette photo?',
      header: 'Cette action est irréversible',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Supprimer',
        severity: 'danger',
      },

      accept: () => {
        this.deletePhoto(fileId);
      },
    });
  }

  confirmDeleteAlbum(event: Event, fileId: string) {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Voulez-vous vraiment supprimer cette album?',
      header: 'Cette action est irréversible',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Supprimer',
        severity: 'danger',
      },

      accept: () => {
        this.deleteAlbum(fileId);
      },
    });
  }

  async deletePhoto(photoId: string) {
    await this.submitPhotoState.request({
      request: this.fileService.deleteFile(photoId),
      onSuccess: () => {
        this.toast.message('success', 'Photo supprimée');
        this.selectedAlbumDetailsResource.reload();
        this.albumsResource.reload();
      },
    });
  }

  startEditAlbum(album: AlbumSummary) {
    this.editingAlbumId.set(album.id);
    this.selectedAlbumId.set(album.id);
    this.editingTitle.set(album.title);
  }

  cancelEdit() {
    this.editingAlbumId.set(null);
    this.editingTitle.set('');
  }

  async saveAlbumTitle(album: AlbumSummary) {
    if (!this.editingTitle() || this.editingTitle() === album.title) {
      this.editingAlbumId.set(null);
      return;
    }

    const updateData: CreateAlbum = {
      id: album.id,
      title: this.editingTitle(),
      authorId: this.authProvider.currentUser()?.id || '',
    };

    await this.submitPhotoState.request({
      request: this.fileService.addMediaToAlbum(updateData, []),
      onSuccess: () => {
        this.toast.message('success', 'Album renommé avec succès');
        this.albumsResource.reload();
        this.editingAlbumId.set(null);
      },
    });
  }

  async deleteAlbum(albumId: string) {
    await this.submitPhotoState.request({
      request: this.fileService.removeCompleteAlbum(albumId, true),
      onSuccess: () => {
        this.toast.message('success', 'Album supprimé');
        this.albumsResource.reload();
      },
    });
  }

  onSelectImage(files: File[]) {
    if (files && files.length > 0) {
      const validFiles = files.filter((file) => {
        const isImage =
          file.type.startsWith('image/') ||
          /\.(jpg|jpeg|png|webp|gif|bmp|tif|tiff|jfif|svg)$/i.test(file.name);
        return isImage;
      });

      if (validFiles.length < files.length) {
        this.toast.message(
          'warn',
          `${files.length - validFiles.length} fichier(s) ignoré(s) (format invalide)`
        );
      }

      // Pour une gestion professionnelle, on préserve l'extension d'origine
      const transformedFiles = validFiles.map((file) => {
        const extension = file.name.split('.').pop() || 'jpg';
        const newName = `${newId()}.${extension}`;
        return new File([file], newName, {type: file.type});
      });

      this.imageFiles.set(transformedFiles);
    }
  }

  resetForm() {
    this.photoForm.reset(DEFAULT_ALBUM(this.authProvider.currentUser()?.id));
    this.imageFiles.set([]);
    this.fileComponent?.clear();
  }

  async submit() {
    const isNew = this.selectedTab() === 'new';
    const formValue = this.photoForm.value;

    const albumData: CreateAlbum = {
      id: (formValue as any).id || newId(),
      title: formValue.title || '',
      authorId: this.authProvider.currentUser()?.id || '',
    };

    // Si on ajoute à un album existant, on utilise l'ID sélectionné
    if (!isNew && this.selectedAlbumId()) {
      albumData.id = this.selectedAlbumId()!;
    }

    await this.submitPhotoState.request({
      request: from(
        (async () => {
          // 1. Upload des nouvelles images
          let resultAlbum: Album | null = null;
          if (this.imageFiles().length > 0) {
            resultAlbum = await firstValueFrom(
              this.fileService.addMediaToAlbum(albumData, this.imageFiles())
            );
          }

          // 2. Déplacement des photos orphelines sélectionnées
          const orphansToMove = this.selectedOrphans();
          const finalAlbumId = resultAlbum?.id || albumData.id;

          if (orphansToMove.length > 0 && finalAlbumId) {
            await firstValueFrom(
              this.fileService.moveMediasAlbum(finalAlbumId, {
                imageIds: orphansToMove,
              })
            );
          }

          return resultAlbum;
        })()
      ),
      onSuccess: () => {
        this.toast.message('success', 'Succès', 'Album bien mis à jour.');
        this.resetForm();
        this.albumsResource.reload();
        this.orphansResource.reload();
        this.selectedAlbumId.set(null);
        this.selectedOrphans.set([]);
      },
    });
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
}
