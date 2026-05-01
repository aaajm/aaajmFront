import {inject, Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthProvider} from '../providers';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  router = inject(Router);
  authProvider = inject(AuthProvider);

  canActivate(): boolean {
    if (!this.authProvider.isLoggedIn() || !this.authProvider.isAdmin()) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
