import {AuthProvider} from '@/app/providers';
import {HttpStateService} from '@/app/services';
import {
  DEFAULT_USER,
  newId,
  runZodValidation,
  Screen,
  ToastService,
} from '@/app/utils';
import {User, UserService} from '@aaajm/client';
import {userSchema} from '@aaajm/client/zod';
import {Component, effect, inject, input, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DatePickerModule} from 'primeng/datepicker';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputMaskModule} from 'primeng/inputmask';
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {Fileupload} from '../file-upload';

@Component({
  selector: 'user-form',
  imports: [
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputGroupModule,
    InputTextModule,
    DatePickerModule,
    InputMaskModule,
    SelectModule,
    Fileupload,
  ],
  templateUrl: './user-form.html',
})
export class UserForm {
  user = input<User | null>(null);
  userService = inject(UserService);
  userState = inject(HttpStateService);
  private formBuilder = inject(FormBuilder);
  logoFile = signal<File | null>(null);
  authProvider = inject(AuthProvider);
  toast = inject(ToastService);

  constructor() {
    effect(() => {
      if (this.user()) this.form.patchValue(this.user()!);
    });
  }

  onSelectLogo(files: File[]) {
    if (files && files.length > 0)
      this.logoFile.set(new File([files[0]], newId()));
  }

  screen = inject(Screen);
  form = this.formBuilder.group<User>(this.user() || DEFAULT_USER());

  zodErrors = signal<Record<string, string | null>>({});

  async submit() {
    this.form.markAllAsTouched();

    const parsedValue = runZodValidation(
      this.form.value,
      userSchema,
      this.zodErrors
    );

    if (!parsedValue.success) return;

    const payload = {...parsedValue.data} as User;
    if (payload.birthdate?.includes('T')) {
      payload.birthdate = payload.birthdate.split('T')[0];
    }
    if (!payload.entranceDate || !String(payload.entranceDate).trim()) {
      payload.entranceDate = new Date().toISOString();
    }

    try {
      await this.userState.request({
        request: this.userService.crupdateUser(
          payload,
          this.logoFile() || undefined
        ),
        onSuccess: (user: User) => {
          this.toast.message(
            'success',
            'Succès',
            `L'utilisateur a été enregistré avec succès.`
          );
          if (this.authProvider.currentUser()?.id === user.id) {
            this.authProvider.setUser(user);
          }
        },
      });
    } catch {
      // HttpStateService affiche déjà le toast d'erreur
    }
  }
}
