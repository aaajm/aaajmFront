import {Skeleton} from '@/app/components/skeleton';
import {TopicSummary} from '@/app/components/topic';
import {TopicSummary as SummaryData, TopicService} from '@aaajm/client';
import {Component, computed, inject, resource} from '@angular/core';
import {SkeletonModule} from 'primeng/skeleton';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'topic-summary-page',
  standalone: true,
  imports: [TopicSummary, SkeletonModule, Skeleton],
  templateUrl: './topic-summary.html',
})
export class TopicSummaryPage {
  topicService = inject(TopicService);

  topicResource = resource({
    loader: ({params}): Promise<SummaryData[]> => {
      return firstValueFrom(this.topicService.getTopics());
    },
  });

  topics = computed(() => {
    if (this.topicResource.hasValue()) {
      return this.topicResource.value();
    }

    return [];
  });
}
