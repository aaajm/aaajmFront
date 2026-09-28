import {AuthProvider, AuthStorage} from './auth.provider';
import {FingerprintService} from '@/app/services';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import {inject} from '@angular/core';
import {MessageService} from 'primeng/api';
import {catchError, from, switchMap, throwError} from 'rxjs';

export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authProvider = inject(AuthProvider);
  const fingerprintService = inject(FingerprintService);
  const toast = inject(MessageService);

  return from(fingerprintService.getFingerprint()).pipe(
    switchMap((fingerprint) => {
      const token = AuthStorage.accessToken();
      const headers: Record<string, string> = {
        'X-User-Fingerprint': fingerprint,
      };
      if (token && !request.headers.has('Authorization')) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const newReq = request.clone({setHeaders: headers});

      return next(newReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            authProvider.logout();
          }
          toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: "Une erreur s'est produite, veuillez réessayer",
          });

          return throwError(() => error);
        })
      );
    })
  );
}
