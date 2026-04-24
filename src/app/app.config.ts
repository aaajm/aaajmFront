import '@/app/config/zod';
import {authInterceptor, AuthStorage} from '@/app/providers';
import {provideApi} from '@aaajm/client';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ApplicationConfig} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import Aura from '@primeuix/themes/aura';
import {MessageService} from 'primeng/api';
import {providePrimeNG} from 'primeng/config';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideApi({
      basePath: import.meta.env.NG_APP_API_URL,
      credentials: {BearerAuth: () => AuthStorage.accessToken()},
    }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
          darkModeSelector: '.none',
        },
      },
    }),
    provideClientHydration(withEventReplay()),
    MessageService,
  ],
};
