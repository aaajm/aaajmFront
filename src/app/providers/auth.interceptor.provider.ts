import {AuthProvider} from '@/app/providers';
import {FingerprintService} from '@/app/services';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, from, switchMap, throwError} from 'rxjs';

export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authProvider = inject(AuthProvider);
  const fingerprintService = inject(FingerprintService);

  return from(fingerprintService.getFingerprint()).pipe(
    switchMap((fingerprint) => {
      const newReq = request.clone({
        headers: request.headers
          .set(
            'Authorization',
            `Bearer ${authProvider.getToken()?.accessToken || ''}`
          )
          .append('X-User-Fingerprint', fingerprint),
      });

      return next(newReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            authProvider.logout();
          }

          return throwError(() => error);
        })
      );
    })
  );
}
