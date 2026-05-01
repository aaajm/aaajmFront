import {safeAddUuid} from './uuid';
import {CreateAlbum} from '../models/album';
import {Partner} from '../models/partner';
import {CreateTopic} from '../models/topic';
import {Signin} from '../models/user';
import {Photo} from '../models/models';

export const DEFAULT_ALBUM = () =>
  safeAddUuid({
    title: '',
    authorId: '',
  }) as CreateAlbum;

export const DEFAULT_PARTNER = () =>
  safeAddUuid({
    name: '',
    email: '',
    phone: '',
    reason: '',
    website: '',
    status: Partner.StatusEnum.Waiting,
  }) as Partner;

export const DEFAULT_TOPIC = () => ({
  title: '',
  description: '',
  authorId: undefined,
  images: [],
}) as CreateTopic;

export const DEFAULT_LOGIN = () => ({
  email: '',
  password: '',
}) as Signin;

export const DEFAULT_PHOTO = () => ({
  titre: '',
  url: '',
  description: '',
  date: new Date(),
  categorie: '',
}) as Photo;
