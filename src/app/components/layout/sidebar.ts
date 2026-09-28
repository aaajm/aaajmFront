import {Screen} from '@/app/utils';
import {Component, inject, signal} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {DrawerModule} from 'primeng/drawer';
import {SidebarContent} from './sidebar-content';
import {SidebarService} from './sidebar.service';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [SidebarContent, DrawerModule, ButtonModule],
  templateUrl: './sidebar.html',
  host: {
    class: 'contents',
  },
})
export class Sidebar {
  screen = inject(Screen);
  visibleSidebar = signal<boolean>(false);
  sidebarService = inject(SidebarService);
  closeSidebar = () => this.visibleSidebar.set(false);
  openSidebar = () => this.visibleSidebar.set(true);
}
