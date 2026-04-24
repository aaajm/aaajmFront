import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BadgeModule} from 'primeng/badge';
import {ButtonModule} from 'primeng/button';
import {FileSelectEvent, FileUploadModule} from 'primeng/fileupload';
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
  ],
  templateUrl: './file-upload.html',
})
export class Fileupload {
  @Output() onSelect = new EventEmitter<File[]>();
  @Input({required: true}) label?: string;
  @Input() multiple: boolean = false;

  onSelectedFiles(event: FileSelectEvent) {
    this.onSelect.emit(event.currentFiles);
  }
}
