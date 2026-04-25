import {PhotoGallery} from '@/app/components/photo-gallery';
import {Component} from '@angular/core';

@Component({
  selector: 'photos-page',
  standalone: true,
  imports: [PhotoGallery],
  templateUrl: './photos.html',
})
export class PhotosPage {}
