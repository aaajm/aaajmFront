import {AuthProvider} from '@/app/providers';
import {Screen, anonymousRoutes} from '@/app/utils';
import {Component, computed, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {DrawerModule} from 'primeng/drawer';
import {ToolbarModule} from 'primeng/toolbar';
import {SidebarService} from './sidebar.service';

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
  authProvider = inject(AuthProvider);
  readonly currentUrl = computed(() => this.router.url);
  sidebarService = inject(SidebarService);
  possibleRoutes = anonymousRoutes[0].items;

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
