import {UserForm} from '@/app/components/user';
import {AuthProvider} from '@/app/providers';
import {labeledRole, ToastService} from '@/app/utils';
import {Role, Status, User, UserService} from '@aaajm/client';
import {HttpClient} from '@angular/common/http';
import {Component, computed, inject, resource, signal} from '@angular/core';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import {MenuModule} from 'primeng/menu';
import {PopoverModule} from 'primeng/popover';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {TooltipModule} from 'primeng/tooltip';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'user-page',
  standalone: true,
  templateUrl: './user-page.html',
  imports: [
    ButtonModule,
    TableModule,
    DialogModule,
    UserForm,
    PopoverModule,
    MenuModule,
    ConfirmDialogModule,
    TagModule,
    TooltipModule,
  ],
  providers: [ConfirmationService],
})
export class UserPage {
  visibleDialog = signal<boolean>(false);
  authProvider = inject(AuthProvider);
  selectedUser = signal<User | null>(null);
  private confirmationService = inject(ConfirmationService);

  asUser(val: any) {
    return val as User;
  }
  Status = Status;
  tagSeverity: {[key: string]: 'info' | 'secondary' | 'success'} = {
    [Role.Admin]: 'info',
    [Role.None]: 'secondary',
    [Role.SuperAdmin]: 'success',
  };
  labeledStatus: {[key: string]: string} = {
    [Status.Enabled]: 'Activé',
    [Status.Disabled]: 'Désactivé',
  };

  labeledRole = labeledRole;

  confirmInvitUser(event: Event, userId: string) {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Voulez-vous vraiment inviter cette personne?',
      header: 'Cette action est irréversible',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Inviter',
        severity: 'danger',
      },

      accept: () => {},
    });
  }

  Role = Role;
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  openDialog = (user?: User | null) => {
    this.selectedUser.set(user || null);
    this.visibleDialog.set(true);
  };
  closeDialog = () => {
    this.selectedUser.set(null);
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
    if (this.selectedUser()?.role == Role.None) {
      items.push({label: 'Inviter', icon: 'pi pi-key'});
    }
    return items;
  });
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

  isDeletable(user: User) {
    return user.role !== Role.Admin && user.role !== Role.SuperAdmin;
  }

  async deleteUser(user: User) {
    if (!this.isDeletable(user)) return;
    if (!user?.id) {
      this.toast.message('error', 'Erreur', "Identifiant de l'utilisateur manquant");
      return;
    }
    if (!confirm(`Voulez-vous vraiment supprimer ${user.firstname} ${user.lastname} ?`)) {
      return;
    }
    try {
      await firstValueFrom(
        this.http.delete(
          `${import.meta.env.NG_APP_API_URL}/users/${encodeURIComponent(user.id)}`,
          {responseType: 'text'}
        )
      );
      this.toast.message('success', 'Succès', 'Utilisateur supprimé');
      this.userResource.reload();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  }
}
