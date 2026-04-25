import {TopicSummary} from '@/app/components/topic';
import {TopicSummary as SummaryData, TopicService} from '@aaajm/client';
import {Component, computed, inject, resource} from '@angular/core';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'topic-summary-page',
  standalone: true,
  imports: [TopicSummary],
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
      console.log(this.topicResource.value());

      return this.topicResource.value();
    }

    return [];
  });
}
