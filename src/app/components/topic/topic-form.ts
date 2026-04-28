import {AuthProvider} from '@/app/providers';
import {HttpStateService} from '@/app/services';
import {DEFAULT_TOPIC, newId, runZodValidation, Screen} from '@/app/utils';
import {CreateTopic, TopicService} from '@aaajm/client';
import {createTopicSchema} from '@aaajm/client/zod';
import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {EditorModule} from 'primeng/editor';
import {InputGroup} from 'primeng/inputgroup';
import {InputTextModule} from 'primeng/inputtext';
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
  private formBuilder = inject(FormBuilder);
  authProvider = inject(AuthProvider);
  topicService = inject(TopicService);
  form = this.formBuilder.group<CreateTopic>(DEFAULT_TOPIC());
  files = signal<File[] | null>(null);
  screen = inject(Screen);
  topicState = inject(HttpStateService);

  zodErrors = signal<Record<string, string | null>>({});

  onSelectFile(files: File[]) {
    if (files && files.length > 0)
      this.files.set(files.map((file) => new File([file], newId())));
  }

  async submit() {
    this.form.markAllAsTouched();

    const parsedValue = runZodValidation(
      this.form.value,
      createTopicSchema,
      this.zodErrors
    );

    if (!parsedValue.success) return;

    await this.topicState.request({
      request: this.topicService.crupdateTopic(
        false,
        {
          ...parsedValue.data,
          authorId: this.authProvider.currentUser()?.id || '',
        },
        this.files()!
      ),

      onSuccess: () => {},
    });
  }
}
