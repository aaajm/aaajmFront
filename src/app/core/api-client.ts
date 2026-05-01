import {InjectionToken} from '@angular/core';
import {AlbumService} from '../services/album.service';
import {PartnerService} from '../services/partner.service';
import {SecurityService} from '../services/security.service';
import {TopicService} from '../services/topic.service';
import {UserService} from '../services/user.service';
import {PhotoService} from '../services/photo.service';

export const API_CONFIG = new InjectionToken<any>('API_CONFIG');

export * from '../models/album';
export * from '../models/partner';
export * from '../models/topic';
export * from '../models/user';
export * from '../models/author';
export * from '../models/models';

export {AlbumService} from '../services/album.service';
export {PartnerService} from '../services/partner.service';
export {SecurityService} from '../services/security.service';
export {TopicService} from '../services/topic.service';
export {UserService} from '../services/user.service';
export {PhotoService} from '../services/photo.service';

export function provideApi(config: {basePath?: string; credentials?: any}) {
  return [
    {
      provide: API_CONFIG,
      useValue: config
    },
    AlbumService,
    PartnerService,
    SecurityService,
    TopicService,
    UserService,
    PhotoService
  ];
}
