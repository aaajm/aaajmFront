import {Screen} from '@/app/utils';
import {Component, inject} from '@angular/core';
import {ImageModule} from 'primeng/image';

@Component({
  selector: 'app-leader-word',
  imports: [ImageModule],
  templateUrl: './leader-word.html',
})
export class LeaderWord {
  screen = inject(Screen);
}
