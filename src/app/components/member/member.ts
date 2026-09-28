import {User} from '@aaajm/client';
import {AuthProvider} from '@/app/providers';
import {CommonModule} from '@angular/common';
import {Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';

@Component({
  selector: 'app-member',
  imports: [CommonModule],
  host: {
    class: 'contents',
  },
  templateUrl: './member.html',
})
export class Member {
  @Input({required: true}) member?: User;
  @Output() deleted = new EventEmitter<string>();
  authProvider = inject(AuthProvider);
  showZoom = signal(false);

  deleteMember(event: Event) {
    event.stopPropagation();
    if (!this.member?.id || !this.authProvider.isAdmin()) return;
    this.deleted.emit(this.member.id);
  }
}
