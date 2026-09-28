import {MemberPage} from '@/app/pages/member';
import {Partners} from '@/app/components/partners/partners';
import {PhotoGallery} from '@/app/components/photo-gallery/photo-gallery';
import {TopicPage} from '@/app/pages/topic';
import {NavigationService} from '@/app/services/navigation.service';
import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';

@Component({
  selector: 'content-layout',
  imports: [
    CommonModule,
    TopicPage,
    MemberPage,
    PhotoGallery,
    Partners,
  ],
  templateUrl: './content-layout.html',
  host: {
    class: 'block h-full min-h-0',
  },
})
export class ContentLayout {
  nav = inject(NavigationService);

  get activeMenu() {
    return this.nav.activeMenu();
  }

  calendarDays = Array.from({length: 31}, (_, i) => i + 1);
  currentDate = new Date();

  setActiveMenu(menu: 'about' | 'contenu' | 'membre' | 'galerie' | 'partenaire') {
    this.nav.navigateTo(menu);
  }
}
