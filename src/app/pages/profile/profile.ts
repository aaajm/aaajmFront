import {UserForm} from '@/app/components/user';
import {AuthProvider} from '@/app/providers';
import {HttpStateService} from '@/app/services';
import {SecurityService} from '@aaajm/client';
import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';

@Component({
  selector: 'profile-page',
  standalone: true,
  imports: [ButtonModule, DialogModule, UserForm],
  templateUrl: './profile.html',
})
export class ProfilePage {
  authProvider = inject(AuthProvider);
  changeState = inject(HttpStateService);
  securityService = inject(SecurityService);
  router = inject(Router);
  currentUser = this.authProvider.currentUser;
  visibleDialog = signal<boolean>(false);

  openDialog = () => {
    this.visibleDialog.set(true);
  };
  closeDialog = () => {
    this.visibleDialog.set(false);
  };

  async changePassword() {
    await this.changeState.request({
      request: this.securityService.resetPassword(
        this.currentUser()?.email || ''
      ),
      onSuccess: (token: string) => {
        this.authProvider.setToken({accessToken: token, refresshToken: ''});
        this.navigate('/change-password');
      },
    });
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
