import {AuthProvider} from '@/app/providers';
import {HttpStateService} from '@/app/services';
import {NavigationService} from '@/app/services/navigation.service';
import {
  DEFAULT_TOPIC,
  newId,
  runZodValidation,
  Screen,
  ToastService,
} from '@/app/utils';
import {Topic, TopicService} from '@aaajm/client';
import {createTopicSchema} from '@aaajm/client/zod';
import {
  Component,
  effect,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {EditorModule} from 'primeng/editor';
import {InputGroup} from 'primeng/inputgroup';
import {InputTextModule} from 'primeng/inputtext';
import {firstValueFrom} from 'rxjs';
import {Fileupload} from '../file-upload';

@Component({
  selector: 'topic-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputGroup,
    InputTextModule,
    EditorModule,
    Fileupload,
    ButtonModule,
  ],
  templateUrl: './topic-form.html',
})
export class TopicForm {
  topicId = input<string | null>(null);
  toast = inject(ToastService);
  private formBuilder = inject(FormBuilder);
  authProvider = inject(AuthProvider);
  topicService = inject(TopicService);
  form = this.formBuilder.group(DEFAULT_TOPIC());
  files = signal<File[] | null>(null);
  screen = inject(Screen);
  topicState = inject(HttpStateService);
  private router = inject(Router);
  private nav = inject(NavigationService);

  topicResource = resource({
    params: () => ({id: this.topicId()!}),
    loader: ({params}): Promise<Topic> => {
      return firstValueFrom(this.topicService.getOneTopic(params.id));
    },
  });

  constructor() {
    effect(() => {
      if (this.topicResource.hasValue()) {
        const topic = this.topicResource.value();
        this.form.patchValue(topic);
      }
    });
  }

  zodErrors = signal<Record<string, string | null>>({});

  onSelectFile(files: File[]) {
    if (files && files.length > 0) {
      this.files.set(
        files.map((file) => {
          const extension = file.name.split('.').pop() || 'jpg';
          return new File([file], `${newId()}.${extension}`, {type: file.type});
        })
      );
    }
  }

  async submit() {
    this.form.markAllAsTouched();

    const parsedValue = runZodValidation(
      this.form.value,
      createTopicSchema,
      this.zodErrors
    );

    if (!parsedValue.success) return;

    const authorId = this.authProvider.currentUser()?.id;
    if (!authorId) {
      this.toast.message('error', 'Erreur', 'Vous devez être connecté');
      return;
    }

    try {
      await this.topicState.request({
        request: this.topicService.crupdateTopic(
          false,
          {...parsedValue.data, authorId},
          this.files() ?? undefined
        ),
        onSuccess: () => {
          this.toast.message('success', 'Succès', 'Contenu mis à jour');
          this.nav.navigateTo('contenu');
          this.router.navigate(['/content']);
        },
      });
    } catch {
      // HttpStateService affiche déjà le toast
    }
  }
}
