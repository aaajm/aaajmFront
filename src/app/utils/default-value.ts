import {CreateTopic, Partner} from '@aaajm/client';
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
