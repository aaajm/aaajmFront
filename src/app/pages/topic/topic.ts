import {Topic} from '@/app/components/topic';
import {HttpStateService} from '@/app/services';
import {Topic as TopicData, TopicService} from '@aaajm/client';
import {Component, computed, inject, input, resource} from '@angular/core';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'topic-page',
  imports: [Topic],
  templateUrl: './topic.html',
})
export class TopicPage {
  topicService = inject(TopicService);
  topicState = inject(HttpStateService);
  topicId = input.required<string>();

  userResource = resource({
    params: () => ({id: this.topicId()}),
    loader: ({params}): Promise<TopicData> => {
      return firstValueFrom(this.topicService.getOneTopic(params.id));
    },
  });

  backTopic = computed(() => {
    if (this.userResource.hasValue()) {
      return this.userResource.value();
    }

    return null;
  });
}
