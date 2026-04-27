import {Member} from '@/app/components/member/member';
import {Skeleton} from '@/app/components/skeleton';
import {User, UserService} from '@aaajm/client';
import {Component, computed, inject, resource} from '@angular/core';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'member-page',
  standalone: true,
  templateUrl: './member.html',
  imports: [Member, Skeleton],
})
export class MemberPage {
  //TODO: handle loading and error states + skeleton
  userService = inject(UserService);

  userResource = resource({
    loader: (): Promise<User[]> => {
      return firstValueFrom(this.userService.getUsers());
    },
  });

  users = computed(() => {
    if (this.userResource.hasValue()) {
      return this.userResource.value();
    }

    return [];
  });
}
