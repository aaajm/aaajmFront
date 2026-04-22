import {Screen} from '@/app/utils';
import {Component, inject} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {ImageModule} from 'primeng/image';

@Component({
  selector: 'app-about',
  imports: [CardModule, ButtonModule, ImageModule],
  templateUrl: './about.html',
})
export class About {
  screen = inject(Screen);
}
