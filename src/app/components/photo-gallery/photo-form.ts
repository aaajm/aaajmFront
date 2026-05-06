import { Component, inject, signal, computed, Pipe, PipeTransform, inject as angularInject, OnInit, resource, HostListener } from '@angular/core';
import { CreateAlbum, FileService, Album, AlbumSummary, FileInfo, MoveMediasAlbumRequest } from '@aaajm/client';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { Fileupload } from '../file-upload';
import { HttpStateService } from '@/app/services';
import { newId, runZodValidation, ToastService } from '@/app/utils';

@Pipe({
  name: 'objectUrl',
  standalone: true
})
export class ObjectUrlPipe implements PipeTransform {
  private sanitizer = angularInject(DomSanitizer);

  transform(file: File | null): SafeUrl | null {
    if (!file) return null;
    const url = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}

@Component({
  selector: 'photo-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputGroupModule,
    // Button retiré des imports
    Fileupload,
    ObjectUrlPipe,
  ],
  templateUrl: './photo-form.html',
})
export class PhotoForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private fileService = inject(FileService);
  private http = inject(HttpClient);
  toast = inject(ToastService);
  submitPhotoState = inject(HttpStateService);

  // Data
  albumsResource = resource({
    loader: () => firstValueFrom(this.fileService.getAlbumSummary('')),
  });

  albums = computed(() => this.albumsResource.value() ?? []);

  // Détails de l'album sélectionné (pour gérer les photos)
  selectedAlbumId = signal<string | null>(null);
  selectedAlbumDetailsResource = resource({
    params: () => ({ id: this.selectedAlbumId() }),
    loader: async ({ params }) => {
      if (!params.id) return null;
      const album = await firstValueFrom(this.fileService.getOneAlbum(params.id));
      console.log('Album chargé:', album);
      return album;
    }
  });

  selectedAlbumDetails = computed(() => this.selectedAlbumDetailsResource.value());

  imageFiles = signal<File[]>([]);
  zodErrors = signal<Record<string, string | null>>({});
  isSubmitting = signal(false);
  isNewAlbum = signal(true);

  currentAuthorId = signal('admin_id');

  // États pour la modification d'album
  editingAlbumId = signal<string | null>(null);
  editingTitle = signal<string>('');
  isActionLoading = signal<boolean>(false);

  // Photos sans album (ex: publications)
  orphansResource = resource({
    loader: () => firstValueFrom(this.http.get<FileInfo[]>(`${import.meta.env.NG_APP_API_URL}/files/orphans`)),
  });

  orphanPhotos = computed(() => this.orphansResource.value() ?? []);
  selectedOrphans = signal<string[]>([]);

  photoForm = this.formBuilder.group({
    id: ['', [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(1)]],
    selectedAlbumId: [''],
    authorId: [{ value: '', disabled: true }, [Validators.required]],
  });

  canSubmit = computed(() => {
    const isNew = this.isNewAlbum();
    const titleValid = isNew ? (this.photoForm.get('title')?.valid ?? false) : true;
    const albumSelected = isNew ? true : !!this.photoForm.get('selectedAlbumId')?.value;
    const hasImage = this.imageFiles().length > 0;
    const hasOrphans = this.selectedOrphans().length > 0;
    const notSubmitting = !this.isSubmitting();

    return titleValid && albumSelected && (hasImage || hasOrphans) && notSubmitting;
  });

  selectedAlbum = computed(() => {
    const id = this.photoForm.get('selectedAlbumId')?.value;
    return this.albums().find(a => a.id === id) || null;
  });

  toggleOrphanSelection(photoId: string | undefined) {
    if (!photoId) return;
    const current = this.selectedOrphans();
    if (current.includes(photoId)) {
      this.selectedOrphans.set(current.filter(id => id !== photoId));
    } else {
      this.selectedOrphans.set([...current, photoId]);
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  ngOnInit() {
    this.resetForm();
  }

  toggleAlbumMode(isNew: boolean) {
    this.isNewAlbum.set(isNew);
    if (isNew) {
      this.photoForm.get('selectedAlbumId')?.setValue('');
      this.photoForm.get('title')?.enable();
    } else {
      this.photoForm.get('title')?.disable();
      // Si on bascule en mode existant et qu'il n'y a qu'un album, on le sélectionne par défaut
      if (this.albums().length === 1) {
        this.selectAlbum(this.albums()[0].id);
      }
    }
  }

  selectAlbum(albumId: string) {
    // Ne pas sélectionner si on est en train de modifier le titre
    if (this.editingAlbumId()) return;
    this.photoForm.get('selectedAlbumId')?.setValue(albumId);
    this.selectedAlbumId.set(albumId);
  }

  async deletePhoto(photoId: string) {
    if (!confirm('Voulez-vous vraiment supprimer cette photo de l\'album ?')) return;

    this.isActionLoading.set(true);
    try {
      await firstValueFrom(this.fileService.deleteFile(photoId));
      this.toast.message('success', 'Photo supprimée');
      this.selectedAlbumDetailsResource.reload();
      this.albumsResource.reload(); // Pour mettre à jour le mediaCount
    } catch (error) {
      this.toast.message('error', 'Erreur lors de la suppression');
    } finally {
      this.isActionLoading.set(false);
    }
  }

  // --- NOUVELLES FONCTIONS ---

  startEditAlbum(event: Event, album: AlbumSummary) {
    event.stopPropagation();
    this.editingAlbumId.set(album.id);
    this.editingTitle.set(album.title);
  }

  cancelEdit(event: Event) {
    event.stopPropagation();
    this.editingAlbumId.set(null);
    this.editingTitle.set('');
  }

  async saveAlbumTitle(event: Event, album: AlbumSummary) {
    event.stopPropagation();
    if (!this.editingTitle() || this.editingTitle() === album.title) {
      this.editingAlbumId.set(null);
      return;
    }

    this.isActionLoading.set(true);
    const updateData: CreateAlbum = {
      id: album.id,
      title: this.editingTitle(),
      authorId: this.currentAuthorId()
    };

    try {
      await firstValueFrom(this.fileService.addMediaToAlbum(updateData, []));
      this.toast.message('success', 'Album renommé avec succès');
      this.albumsResource.reload();
    } catch (error) {
      this.toast.message('error', 'Erreur lors de la modification');
    } finally {
      this.editingAlbumId.set(null);
      this.isActionLoading.set(false);
    }
  }

  async deleteAlbum(event: Event, album: AlbumSummary) {
    event.stopPropagation();
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'album "${album.title}" et toutes ses photos ?`)) {
      return;
    }

    this.isActionLoading.set(true);
    try {
      await firstValueFrom(this.fileService.removeCompleteAlbum(album.id, true));
      this.toast.message('success', 'Album supprimé');

      // Si l'album supprimé était sélectionné, on réinitialise
      if (this.photoForm.get('selectedAlbumId')?.value === album.id) {
        this.photoForm.get('selectedAlbumId')?.setValue('');
      }

      this.albumsResource.reload();
    } catch (error) {
      this.toast.message('error', 'Erreur lors de la suppression');
    } finally {
      this.isActionLoading.set(false);
    }
  }

  onSelectImage(files: File[]) {
    if (files && files.length > 0) {
      const validFiles = files.filter(file => {
        const isImage = file.type.startsWith('image/') || 
                        /\.(jpg|jpeg|png|webp|gif|bmp|tif|tiff|jfif|svg)$/i.test(file.name);
        return isImage;
      });

      if (validFiles.length < files.length) {
        this.toast.message('warn', `${files.length - validFiles.length} fichier(s) ignoré(s) (format invalide)`);
      }

      this.imageFiles.set(validFiles);
    }
  }

  removeImage(index: number) {
    const current = this.imageFiles();
    this.imageFiles.set(current.filter((_, i) => i !== index));
  }

  clearImage() {
    this.imageFiles.set([]);
  }

  resetForm() {
    this.photoForm.reset({
      id: newId(),
      title: '',
      selectedAlbumId: '',
      authorId: this.currentAuthorId()
    });
    this.isNewAlbum.set(true);
    this.imageFiles.set([]);
    this.zodErrors.set({});
  }

  async submit() {
    if (!this.canSubmit()) return;

    this.isSubmitting.set(true);

    const isNew = this.isNewAlbum();
    const selectedAlbum = this.selectedAlbum();

    const albumData: CreateAlbum = {
      id: isNew ? (this.photoForm.get('id')?.value ?? newId()) : selectedAlbum?.id!,
      title: isNew ? (this.photoForm.get('title')?.value ?? 'Sans titre') : (selectedAlbum?.title || ''),
      authorId: this.currentAuthorId()
    };

    try {
      const albumId = albumData.id!;
      
      // 1. Ajouter les nouvelles images si présentes
      if (this.imageFiles().length > 0) {
        await firstValueFrom(this.fileService.addMediaToAlbum(albumData, this.imageFiles()));
      } else if (isNew) {
        // Si c'est un nouvel album sans nouvelle image, on doit quand même le créer
        // On peut appeler l'API de création d'album vide (à voir si elle existe)
        // Pour l'instant on suppose que addMediaToAlbum avec liste vide fonctionne ou on crée l'album autrement
        await firstValueFrom(this.http.put(`${import.meta.env.NG_APP_API_URL}/albums`, { ...albumData, images: [] }));
      }

      // Déplacer les photos orphelines sélectionnées vers cet album
      if (this.selectedOrphans().length > 0) {
        await firstValueFrom(this.http.post(`${import.meta.env.NG_APP_API_URL}/albums/${albumId}`, {
          imageIds: this.selectedOrphans()
        }));
      }

      this.toast.message('success', isNew ? 'Album créé avec succès' : 'Photo ajoutée et album mis à jour');
      this.resetForm();
      this.albumsResource.reload();
      this.orphansResource.reload();
      this.selectedOrphans.set([]);

    } catch (error) {
      console.error('API Error:', error);
      this.toast.message('error', 'Erreur lors de l\'envoi de la photo');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Viewer state
  viewerVisible = signal(false);
  viewerImages = signal<FileInfo[]>([]);
  currentIndex = signal(0);

  openViewer(images: FileInfo[], startAt: number = 0) {
    console.log('Ouverture du viewer:', { imagesCount: images.length, startAt });
    this.viewerImages.set(images);
    this.currentIndex.set(startAt);
    this.viewerVisible.set(true);
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

  openPreviewViewer(index: number) {
    const files = this.imageFiles();
    if (files.length === 0) return;
    
    const previewMedias = files.map((file, i) => ({
      file_url: URL.createObjectURL(file),
      id: `preview-${i}`
    }));
    
    this.openViewer(previewMedias as any, index);
  }
}