import {Injectable, signal} from '@angular/core';

export type MenuSection = 'about' | 'contenu' | 'membre' | 'galerie' | 'partenaire';

@Injectable({providedIn: 'root'})
export class NavigationService {
  activeMenu = signal<MenuSection>('contenu');
  galleryReloadTick = signal(0);

  navigateTo(section: MenuSection) {
    this.activeMenu.set(section);
    if (section === 'galerie') {
      this.galleryReloadTick.update((n) => n + 1);
    }
  }
}
