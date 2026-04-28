import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Album } from '@aaajm/client';

@Component({
  selector: 'photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.html',
  styleUrl: './photo-gallery.css',
})
export class PhotoGallery {
  activeTab = 'photos';
  selectedAlbum: Album | null = null;

  tabs = [
    { id: 'photos', label: "Photos" },
    { id: 'albums', label: 'Albums' },
    { id: 'tagged', label: 'Identifications' },
  ];

  albums: Album[] = [

    {
      id: '1',
      title: 'Voyage à Majunga',
      creationDatetime: new Date().toISOString(),
      createdBy: { id: 'admin', name: 'Admin', email: 'admin@aaajm.com', role: 'ADMIN' as any },
      medias: [
        { id: '101', file_url: 'https://picsum.photos/id/1011/800/800' },
        { id: '102', file_url: 'https://picsum.photos/id/1012/800/800' },
        { id: '103', file_url: 'https://picsum.photos/id/1013/800/800' },
      ]
    },
    {
      id: '2',
      title: 'Événement Sportif',
      creationDatetime: new Date().toISOString(),
      createdBy: { id: 'admin', name: 'Admin', email: 'admin@aaajm.com', role: 'ADMIN' as any },
      medias: [
        { id: '201', file_url: 'https://picsum.photos/id/1014/800/800' },
        { id: '202', file_url: 'https://picsum.photos/id/1015/800/800' },
        { id: '203', file_url: 'https://picsum.photos/id/1016/800/800' },
      ]
    },
    {
      id: '3',
      title: 'Réunion AAAJM',
      creationDatetime: new Date().toISOString(),
      createdBy: { id: 'admin', name: 'Admin', email: 'admin@aaajm.com', role: 'ADMIN' as any },
      medias: [
        { id: '301', file_url: 'https://picsum.photos/id/1018/800/800' },
        { id: '302', file_url: 'https://picsum.photos/id/1019/800/800' },
        { id: '303', file_url: 'https://picsum.photos/id/1020/800/800' },
      ]
    }
  ];


  allPhotos = [
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
  ];

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
    this.selectedAlbum = null;
  }

  selectAlbum(album: Album) {
    this.selectedAlbum = album;
  }

  backToAlbums() {
    this.selectedAlbum = null;
  }
}

