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
      const isSigninRequest = request.url.includes('/authentication/signin');
      if (token && !request.headers.has('Authorization') && !isSigninRequest) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const newReq = request.clone({setHeaders: headers});

      return next(newReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (isSigninRequest) {
            const detailMsg = error.error?.message || "Email ou mot de passe incorrect";
            toast.add({
              severity: 'error',
              summary: 'Échec de connexion',
              detail: detailMsg,
            });
          } else if (error.status === 401 || error.status === 403) {
            authProvider.logout();
            toast.add({
              severity: 'error',
              summary: 'Session expirée',
              detail: 'Votre session a expiré ou vous n\'avez pas la permission. Veuillez vous reconnecter.',
            });
          } else {
            toast.add({
              severity: 'error',
              summary: 'Erreur',
              detail: error.error?.message || "Une erreur s'est produite, veuillez réessayer",
            });
          }

          return throwError(() => error);
        })
      );
    })
  );
}
