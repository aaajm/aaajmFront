import {formatDatetime} from '@/app/utils/date';
import {FileInfo, Topic as TopicData} from '@aaajm/client';
import {Component, computed, Input, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {EditorModule} from 'primeng/editor';
import {Image} from 'primeng/image';
import {SkeletonModule} from 'primeng/skeleton';

import {GalleriaModule} from 'primeng/galleria';

const DEFAULT_TRUNCATION_LENGTH = 700;

export const truncateText = (
  text: string,
  maxLength = DEFAULT_TRUNCATION_LENGTH
) => {
  return {
    text,
    truncated: text.slice(0, maxLength),
    overflows: text.length > maxLength,
  };
};

@Component({
  selector: 'topic',
  imports: [
    AvatarModule,
    ButtonModule,
    EditorModule,
    FormsModule,
    Image,
    GalleriaModule,
    SkeletonModule,
  ],
  templateUrl: './topic.html',
})
export class Topic {
  @Input({required: true}) topic!: TopicData | null;
  formatDate = formatDatetime;
  editorLoaded = signal(true);

  collapsed = signal(true);
  toggleCollapsed = () => this.collapsed.set(!this.collapsed());

  asFile(val: any): FileInfo {
    return val;
  }
  textState = computed(() =>
    truncateText(this.topic?.description || '', DEFAULT_TRUNCATION_LENGTH)
  );

  handleInit() {
    this.editorLoaded.set(true);
  }
}
