import {AuthProvider} from '@/app/providers';
import {anonymousRoutes, authRoutes} from '@/app/utils';
import {Screen} from '@/app/utils/screen';
import {Component, computed, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {DrawerModule} from 'primeng/drawer';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {labeledRole} from '../../utils/default-value';
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

  labeledRole = labeledRole;

  asMenu(val: any): MenuItem {
    return val;
  }

  possibleRoutes = computed(() => {
    return this.authProvider.isLoggedIn()
      ? [...anonymousRoutes, ...authRoutes]
      : anonymousRoutes;
  });

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
