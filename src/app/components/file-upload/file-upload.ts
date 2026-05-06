import {Component, EventEmitter, Input, Output, viewChild} from '@angular/core';
import {BadgeModule} from 'primeng/badge';
import {ButtonModule} from 'primeng/button';
import {
  FileSelectEvent,
  FileUpload,
  FileUploadModule,
} from 'primeng/fileupload';
import {ImageModule} from 'primeng/image';
import {ProgressBarModule} from 'primeng/progressbar';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'file-uploader',
  standalone: true,
  imports: [
    BadgeModule,
    ButtonModule,
    FileUploadModule,
    ProgressBarModule,
    ToastModule,
    ImageModule,
  ],
  templateUrl: './file-upload.html',
})
export class Fileupload {
  readonly primeUpload = viewChild<FileUpload>('pUpload');
  @Output() onSelect = new EventEmitter<File[]>();
  @Input({required: true}) label?: string;
  @Input() multiple: boolean = false;
  @Input() accept: string =
    'image/*, .jpg, .jpeg, .png, .webp, .gif, .bmp, .tif, .tiff, .jfif, .svg';
  @Input() maxFileSize: number = 20000000; // 20MB default to avoid frontend blocking
  @Input() showPreview: boolean = true;

  onSelectedFiles(event: FileSelectEvent) {
    this.onSelect.emit(event.currentFiles);
  }

  clear() {
    this.primeUpload()?.clear();
  }

  onRemoveTemplatingFile(
    event: MouseEvent,
    files: File[],
    removeFileCallback: (event: MouseEvent, index: number) => void,
    index: number
  ) {
    event.stopPropagation();
    removeFileCallback(event, index);
    this.onSelect.emit(files);
  }
}
