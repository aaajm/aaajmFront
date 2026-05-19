import {About} from '@/app/components/about';
import {Banner} from '@/app/components/banner/banner';
import {LeaderWord} from '@/app/components/leader-word';
import {Mission} from '@/app/components/mission';
import {Partner} from '@/app/components/partner/partner';
import {Component} from '@angular/core';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [About, LeaderWord, Mission, Banner, Partner],
  templateUrl: './home.html',
})
export class HomePage {}
