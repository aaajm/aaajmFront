import {User} from '@aaajm/client';
import {Component, Input} from '@angular/core';
import {Image} from 'primeng/image';

@Component({
  selector: 'app-member',
  imports: [Image],
  host: {
    class: 'contents',
  },
  templateUrl: './member.html',
})
export class Member {
  @Input({required: true}) member?: User;
}
