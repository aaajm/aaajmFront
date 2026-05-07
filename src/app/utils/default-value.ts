// utils/default-value.ts
import {
  CreateAlbum,
  CreateTopic,
  Partner,
  Role,
  Sex,
  Status,
  User,
} from '@aaajm/client';
import {safeAddUuid} from './uuid';

export const DEFAULT_PARTNER = () =>
  safeAddUuid({
    name: '',
    email: '',
    phone: '',
    reason: '',
    website: '',
    status: Partner.StatusEnum.Waiting,
    address: '',
  }) as Partner;

export const DEFAULT_LOGIN = {email: '', password: ''};

export const DEFAULT_TOPIC = () =>
  safeAddUuid({
    title: '',
    description: '',
    authorId: '',
  }) as CreateTopic;

export const DEFAULT_ALBUM = (authorId?: string) =>
  safeAddUuid({
    title: '',
    authorId: authorId || '',
  }) as CreateAlbum;

export const DEFAULT_USER = () =>
  safeAddUuid({
    firstname: '',
    lastname: '',
    sex: Sex.M,
    birthdate: '',
    address: '',
    email: '',
    phone: '',
    entranceDate: '',
    postOffice: '',
    status: Status.Disabled,
    role: Role.None,
    profile: '',
  }) as User;

export const labeledRole: {[key: string]: string} = {
  [Role.Admin]: 'Administrateur',
  [Role.None]: 'Aucun',
  [Role.SuperAdmin]: 'G.Administrateur',
};
