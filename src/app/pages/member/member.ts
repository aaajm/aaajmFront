import {Member} from '@/app/components/member/member';
import {Skeleton} from '@/app/components/skeleton';
import {AuthProvider} from '@/app/providers';
import {ToastService} from '@/app/utils';
import {Role, User, UserService} from '@aaajm/client';
import {HttpClient} from '@angular/common/http';
import {Component, computed, inject, resource} from '@angular/core';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'member-page',
  standalone: true,
  templateUrl: './member.html',
  imports: [Member, Skeleton],
})
export class MemberPage {
  userService = inject(UserService);
  authProvider = inject(AuthProvider);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

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

  async deleteMember(memberId: string, member: User) {
    if (!this.authProvider.isAdmin()) return;
    if (member.role === Role.Admin || member.role === Role.SuperAdmin) {
      this.toast.message(
        'warn',
        'Action refusée',
        'Impossible de supprimer un administrateur'
      );
      return;
    }
    if (
      !confirm(
        `Voulez-vous vraiment supprimer ${member.firstname} ${member.lastname} ?`
      )
    ) {
      return;
    }
    try {
      await firstValueFrom(
        this.http.delete(
          `${import.meta.env.NG_APP_API_URL}/users/${encodeURIComponent(memberId)}`,
          {responseType: 'text'}
        )
      );
      this.toast.message('success', 'Succès', 'Membre supprimé');
      this.userResource.reload();
    } catch (err) {
      console.error('Failed to delete member', err);
    }
  }
}
