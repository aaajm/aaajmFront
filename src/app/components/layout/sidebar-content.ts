import {AuthProvider} from '@/app/providers';
import {Screen} from '@/app/utils/screen';
import {Component, computed, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {DrawerModule} from 'primeng/drawer';
type Route = {
  url: string;
  label: string;
  authorized: boolean;
};

@Component({
  selector: 'sidebar-content',
  imports: [AvatarModule, DrawerModule, ButtonModule],
  templateUrl: './sidebar-content.html',
})
export class SidebarContent {
  private router = inject(Router);
  screen = inject(Screen);
  authProvider = inject(AuthProvider);
  readonly loggedUser = computed(() => this.authProvider.currentUser());
  readonly currentUrl = computed(() => this.router.url);

  possibleRoutes = computed<Route[]>(() => {
    return [
      {
        url: '/profile',
        label: 'Mon profil',
        authorized: this.authProvider.isLoggedIn(),
      },
      {
        url: '/home',
        label: 'Qui somme nous',
        authorized: true,
      },
      {
        url: '/member',
        label: 'Nos membres',
        authorized: true,
      },
      {
        url: '/album',
        label: 'Galerie',
        authorized: true,
      },
      {
        url: '/content',
        label: 'Contenu',
        authorized: true,
      },
      {
        url: '/partner',
        label: 'Partenaires',
        authorized: true,
      },
      {
        url: '/user',
        label: 'Utilisateurs',
        authorized: this.authProvider.isLoggedIn(),
      },
      {
        url: '/topic',
        label: 'Actialités',
        authorized: this.authProvider.isLoggedIn(),
      },
    ];
  });

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
