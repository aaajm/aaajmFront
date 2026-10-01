import {TopicForm} from '@/app/components/topic';
import {AuthProvider} from '@/app/providers';
import {formatDatetime, ToastService} from '@/app/utils';
import {TopicService, TopicSummary} from '@aaajm/client';
import {Component, computed, inject, resource, signal, Pipe, PipeTransform} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {firstValueFrom} from 'rxjs';

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {
  transform(value: any): string {
    return formatDatetime(value) || '';
  }
}

@Component({
  selector: 'topic-manage',
  standalone: true,
  imports: [ButtonModule, TableModule, DialogModule, TopicForm, FormatDatePipe],
  templateUrl: './topic-manage.html',
})
export class TopicManage {
  visibleDialog = signal<boolean>(false);
  selectedTopic = signal<TopicSummary | null>(null);
  asTopic(val: any): TopicSummary {
    return val;
  }
  authProvider = inject(AuthProvider);
  topicService = inject(TopicService);
  private toast = inject(ToastService);

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
      return [...this.topicResource.value()].sort((a, b) => {
        const da = new Date(a.creationDatetime || 0).getTime();
        const db = new Date(b.creationDatetime || 0).getTime();
        return db - da;
      });
    }

    return [];
  });

  async deleteTopic(topic: TopicSummary) {
    if (!confirm('Voulez-vous vraiment supprimer ce contenu ?')) {
      return;
    }
    const deleteImage = confirm(
      'Supprimer aussi les photos associées (galerie incluse) ?'
    );
    try {
      await firstValueFrom(this.topicService.deleteTopic(topic.id, deleteImage));
      this.toast.message(
        'success',
        'Succès',
        deleteImage ? 'Contenu et photos supprimés' : 'Contenu supprimé'
      );
      this.topicResource.reload();
    } catch (err) {
      console.error('Failed to delete topic', err);
    }
  }
}
