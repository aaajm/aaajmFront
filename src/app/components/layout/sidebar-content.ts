import {AuthProvider} from '@/app/providers';
import {Screen} from '@/app/utils/screen';
import {Component, computed, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {DrawerModule} from 'primeng/drawer';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
type Route = {
  url: string;
  label: string;
  authorized: boolean;
};

@Component({
  selector: 'sidebar-content',
  imports: [
    AvatarModule,
    DrawerModule,
    ButtonModule,
    MenuModule,
    MenubarModule,
  ],
  templateUrl: './sidebar-content.html',
})
export class SidebarContent {
  private router = inject(Router);
  screen = inject(Screen);
  authProvider = inject(AuthProvider);
  readonly loggedUser = computed(() => this.authProvider.currentUser());
  readonly currentUrl = computed(() => this.router.url);

  asMenu(val: any): MenuItem {
    return val;
  }

  authRoutes: MenuItem[] = [
    {
      label: 'Administrateur',
      items: [
        {
          routerLink: '/profile',
          label: 'Mon profil',
        },

        {
          routerLink: '/user',
          label: 'Utilisateurs',
        },
        {
          routerLink: '/topic',
          label: 'Actialités',
        },
        {
          routerLink: '/photo-form',
          label: 'Album',
        },
      ],
    },
  ];
  anonymousRoutes: MenuItem[] = [
    {
      label: 'Navigation',
      items: [
        {
          routerLink: '/home',
          label: 'Qui somme nous',
        },
        {
          routerLink: '/member',
          label: 'Nos membres',
        },
        {
          routerLink: '/album',
          label: 'Galerie',
        },
        {
          routerLink: '/content',
          label: 'Contenu',
        },
        {
          routerLink: '/partner',
          label: 'Partenaires',
        },
      ],
    },
  ];

  possibleRoutes = computed(() => {
    return this.authProvider.isLoggedIn()
      ? [...this.anonymousRoutes, ...this.authRoutes]
      : this.anonymousRoutes;
  });

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
