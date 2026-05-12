import {Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SidebarService {
  visible = signal(false);

  toggle() {
    this.visible.update((v) => !v);
  }
  open() {
    this.visible.set(true);
  }
  close() {
    this.visible.set(false);
  }
}
