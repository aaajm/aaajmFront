import {Screen} from '@/app/utils';
import {Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {DrawerModule} from 'primeng/drawer';
import {ToolbarModule} from 'primeng/toolbar';

@Component({
  selector: 'app-navbar',
  imports: [
    ToolbarModule,
    AvatarModule,
    ButtonModule,
    DrawerModule,
    AvatarModule,
  ],
  templateUrl: './navbar.html',
})
export class Navbar {
  screen = inject(Screen);
  router = inject(Router);
  readonly currentUrl = computed(() => this.router.url);
  visibleDrawer = signal(false);
  toggleDrawer() {
    this.visibleDrawer.update((v) => !v);
  }
  openDrawer() {
    this.visibleDrawer.set(true);
  }
  closeDrawer() {
    this.visibleDrawer.set(false);
  }

  possibleRoutes = [
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
      url: '/photos',
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
  ];

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
