import { HttpStateService } from '@/app/services';
import {
  DEFAULT_PHOTO,
  newId,
  runZodValidation,
  ToastService,
} from '@/app/utils';
import { Photo } from '@/app/models/models';
import { PhotoService } from '@/app/services';
import { photoSchema } from '@/app/utils/zod';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { Fileupload } from '../file-upload';

@Component({
  selector: 'photo-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputGroupModule,
    Button,
    Fileupload,
  ],
  templateUrl: './photo-form.html',
})
export class PhotoForm {
  private formBuilder = inject(FormBuilder);
  private photoService = inject(PhotoService);
  toast = inject(ToastService);

  // Initialisation avec les valeurs par défaut
  photoForm = this.formBuilder.group<Photo>(DEFAULT_PHOTO());

  // Gestion d'état
  submitPhotoState = inject(HttpStateService);
  zodErrors = signal<Record<string, string | null>>({});
  imageFile = signal<File | null>(null);

  // Sélection de l'image
  onSelectImage(files: File[]) {
    if (files && files.length > 0)
      this.imageFile.set(new File([files[0]], newId()));
  }

  // Soumission
  async submit() {
    this.photoForm.markAllAsTouched();

    const parsedValue = runZodValidation(
      this.photoForm.value,
      photoSchema,
      this.zodErrors
    );

    if (!parsedValue.success) return;

    await this.submitPhotoState.request({
      request: this.photoService.addPhoto(
        parsedValue.data! as Photo,
        this.imageFile() ? this.imageFile()! : undefined
      ),
      onSuccess: () => {
        this.toast.message('success', 'Photo ajoutée avec succès.');
        this.toast.message('success', 'Elle sera visible après validation.');
        this.photoForm.reset(DEFAULT_PHOTO());
        this.imageFile.set(null);
      },
    });
  }
}
