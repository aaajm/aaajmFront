import {formatDatetime} from '@/app/utils/date';
import {Topic as TopicData} from '@aaajm/client';
import {Component, Input, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {EditorModule} from 'primeng/editor';
import {Image} from 'primeng/image';
import {SkeletonModule} from 'primeng/skeleton';

@Component({
  selector: 'topic',
  imports: [
    AvatarModule,
    ButtonModule,
    EditorModule,
    FormsModule,
    Image,
    SkeletonModule,
  ],
  templateUrl: './topic.html',
})
export class Topic {
  @Input({required: true}) topic!: TopicData | null;
  formatDate = formatDatetime;
  editorLoaded = signal(false);

  handleInit() {
    this.editorLoaded.set(true);
  }
}
