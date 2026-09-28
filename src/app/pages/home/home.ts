import {About} from '@/app/components/about';
import {Banner} from '@/app/components/banner/banner';
import {LeaderWord} from '@/app/components/leader-word';
import {Mission} from '@/app/components/mission';
import {Partner} from '@/app/components/partner/partner';
import {Partners} from '@/app/components/partners/partners';
import {Component} from '@angular/core';

@Component({
  selector: 'home-page',
  standalone: true,

  imports: [About, LeaderWord, Mission, Banner, Partner, Partners],
  templateUrl: './home.html',
})
export class HomePage {}
