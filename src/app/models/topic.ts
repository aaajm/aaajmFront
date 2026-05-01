import {Author} from './author';
import {FileInfo} from './album';

export interface Topic {
  id?: string;
  title: string;
  description: string;
  authorId?: number;
  images?: FileInfo[];
  creationDatetime?: string;
  createdBy?: Author;
}

export interface CreateTopic {
  title: string;
  description: string;
  authorId?: number;
  images?: string[];
}
