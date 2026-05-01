import {Author} from './author';

export interface FileInfo {
  id: string;
  file_url: string;
}

export interface Album {
  id: string;
  title: string;
  creationDatetime?: string;
  medias?: FileInfo[];
  createdBy?: Author;
}

export interface CreateAlbum {
  id: string;
  title: string;
  authorId: string;
}

export interface AlbumSummary {
  id: string;
  title: string;
}
