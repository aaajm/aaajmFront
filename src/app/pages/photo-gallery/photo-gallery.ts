import {PhotoForm} from '@/app/components/photo-gallery';
import {Component} from '@angular/core';

@Component({
  selector: 'photo-gallery-page',
  standalone: true,
  templateUrl: './photo-gallery.html',
  imports: [PhotoForm],
})
export class PhotoGalleryPage {}
