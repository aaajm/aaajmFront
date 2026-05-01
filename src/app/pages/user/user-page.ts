import {UserForm} from '@/app/components/user';
import {AuthProvider} from '@/app/providers';
import {Role, Status, User, UserService} from '@aaajm/client';
import {Component, computed, inject, resource, signal} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
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
    TagModule,
    TooltipModule,
  ],
})
export class UserPage {
  visibleDialog = signal<boolean>(false);
  authProvider = inject(AuthProvider);
  selectedUser = signal<User | null>(null);
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

  labeledRole: {[key: string]: string} = {
    [Role.Admin]: 'Administrateur',
    [Role.None]: 'Aucun',
    [Role.SuperAdmin]: 'G.Administrateur',
  };

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
}
