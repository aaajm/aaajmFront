import {About} from '@/app/components/about';
import {LeaderWord} from '@/app/components/leader-word';
import {Mission} from '@/app/components/mission';
import {Banner} from '@/app/components/banner/banner';
import {Component} from '@angular/core';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [About, LeaderWord, Mission, Banner],
  templateUrl: './home.html',
})
export class HomePage {}
