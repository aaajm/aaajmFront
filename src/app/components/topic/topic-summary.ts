import {formatDatetime} from '@/app/utils';
import {TopicSummary as SummaryData} from '@aaajm/client';
import {Component, inject, Input} from '@angular/core';
import {Router} from '@angular/router';
import {AvatarModule} from 'primeng/avatar';
import {CardModule} from 'primeng/card';
import {ImageModule} from 'primeng/image';
import {TagModule} from 'primeng/tag';

@Component({
  selector: 'topic-summary',
  standalone: true,
  imports: [CardModule, ImageModule, TagModule, AvatarModule],
  templateUrl: './topic-summary.html',
})
export class TopicSummary {
  @Input({required: true}) summary!: SummaryData;
  router = inject(Router);
  formatDate = formatDatetime;
  //TODO: add tag
  navigate(route: string) {
    this.router.navigate([route]);
  }
}
