import {Member} from '@/app/components/member/member';
import {User, UserService} from '@aaajm/client';
import {Component, computed, inject, resource} from '@angular/core';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'member-page',
  standalone: true,
  templateUrl: './member.html',
  imports: [Member],
})
export class MemberPage {
  //TODO: user profile from backend
  //TODO: handle loading and error states + skeleton
  userService = inject(UserService);

  userResource = resource({
    loader: ({params}): Promise<User[]> => {
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
