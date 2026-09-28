import {Banner} from '@/app/components/banner';
import {Skeleton} from '@/app/components/skeleton';
import {Topic} from '@/app/components/topic';
import {HttpStateService} from '@/app/services';
import {PagedTopic, Topic as TopicData, TopicService} from '@aaajm/client';
import {Component, computed, inject, input, resource} from '@angular/core';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'topic-page',
  imports: [Topic, Skeleton],
  templateUrl: './topic.html',
})
export class TopicPage {
  topicService = inject(TopicService);
  topicState = inject(HttpStateService);
  topicId = input<string>();

  // TODO: pageable
  topicResource = resource({
    params: () => ({page: 1, pageSize: 100}),
    loader: ({params}): Promise<PagedTopic> => {
      return firstValueFrom(
        this.topicService.getAllTopic(params.page, params.pageSize)
      );
    },
  });

  topics = computed(() => {
    if (this.topicResource.hasValue()) {
      const data = this.topicResource.value().data || ([] as TopicData[]);
      return [...data].sort((a, b) => {
        const da = new Date(a.creationDatetime || 0).getTime();
        const db = new Date(b.creationDatetime || 0).getTime();
        return db - da;
      });
    }
    return [];
  });
}
