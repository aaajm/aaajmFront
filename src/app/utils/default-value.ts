import {Partner} from '@aaajm/client';
import {safeAddUuid} from './uuid';

export const DEFAULT_PARTNER = () =>
  safeAddUuid({
    name: '',
    email: '',
    phone: '',
    reason: '',
    website: '',
    status: Partner.StatusEnum.Waiting,
  });

export const DEFAULT_LOGIN = {email: '', password: ''};
