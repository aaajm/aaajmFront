import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photos.html',
})
export class PhotosPage {
  activeTab = 'vos-photos';

  tabs = [
    { id: 'vos-photos', label: "AAAJM's Photos" },
    { id: 'tagged', label: 'Tagged photos' },
    { id: 'albums', label: 'Albums' },
  ];

  photos = [
    { url: 'https://picsum.photos/id/1011/400/400', alt: 'Photo 1' },
    { url: 'https://picsum.photos/id/1012/400/400', alt: 'Photo 2' },
    { url: 'https://picsum.photos/id/1013/400/400', alt: 'Photo 3' },
    { url: 'https://picsum.photos/id/1014/400/400', alt: 'Photo 4' },
    { url: 'https://picsum.photos/id/1015/400/400', alt: 'Photo 5' },
    { url: 'https://picsum.photos/id/1016/400/400', alt: 'Photo 6' },
    { url: 'https://picsum.photos/id/1018/400/400', alt: 'Photo 7' },
    { url: 'https://picsum.photos/id/1019/400/400', alt: 'Photo 8' },
    { url: 'https://picsum.photos/id/1020/400/400', alt: 'Photo 9' },
    { url: 'https://picsum.photos/id/1021/400/400', alt: 'Photo 10' },
    { url: 'https://picsum.photos/id/1022/400/400', alt: 'Photo 11' },
    { url: 'https://picsum.photos/id/1023/400/400', alt: 'Photo 12' },
    { url: 'https://picsum.photos/id/1024/400/400', alt: 'Photo 13' },
    { url: 'https://picsum.photos/id/1025/400/400', alt: 'Photo 14' },
    { url: 'https://picsum.photos/id/1026/400/400', alt: 'Photo 15' },
  ];

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }
}
