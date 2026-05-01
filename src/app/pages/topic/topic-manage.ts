import {TopicForm} from '@/app/components/topic';
import {AuthProvider} from '@/app/providers';
import {formatDatetime} from '@/app/utils';
import {TopicService, TopicSummary} from '@aaajm/client';
import {Component, computed, inject, resource, signal} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'topic-manage',
  standalone: true,
  imports: [ButtonModule, TableModule, DialogModule, TopicForm],
  templateUrl: './topic-manage.html',
})
export class TopicManage {
  visibleDialog = signal<boolean>(false);
  selectedTopic = signal<TopicSummary | null>(null);
  asTopic(val: any): TopicSummary {
    return val;
  }
  formatDate = formatDatetime;
  authProvider = inject(AuthProvider);
  topicService = inject(TopicService);

  openDialog = (topic?: TopicSummary | null) => {
    this.selectedTopic.set(topic || null);
    this.visibleDialog.set(true);
  };
  closeDialog = () => {
    this.selectedTopic.set(null);
    this.visibleDialog.set(false);
  };

  menuItems = computed<MenuItem[]>(() => {
    const items: MenuItem[] = [
      {
        label: 'Modifier',
        icon: 'pi pi-pencil',
        command: () => {
          this.openDialog();
        },
      },
    ];
    return items;
  });

  topicResource = resource({
    loader: (): Promise<TopicSummary[]> => {
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
