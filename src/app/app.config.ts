import {authInterceptor} from '@/app/providers';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import Aura from '@primeuix/themes/aura';
import {MessageService} from 'primeng/api';
import {providePrimeNG} from 'primeng/config';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
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
    MessageService,
  ],
};
