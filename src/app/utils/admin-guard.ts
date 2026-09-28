import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthProvider} from '../providers';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  router = inject(Router);
  authProvider = inject(AuthProvider);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authProvider.isLoggedIn()) {
      this.authProvider.redirectUrl = state.url;
      this.router.navigate(['/authentication/signin']);
      return false;
    }

    if (!this.authProvider.isAdmin()) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
