import {AuthProvider} from '@/app/providers';
import {HttpStateService} from '@/app/services';
import {runZodValidation, ToastService} from '@/app/utils';
import {Screen} from '@/app/utils/screen';
import {ChangePassword as Password, SecurityService} from '@aaajm/client';
import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputOtpModule} from 'primeng/inputotp';
import {InputTextModule} from 'primeng/inputtext';
import z from 'zod';

const passwordSchema = z
  .object({
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
    otpCode: z.string().min(5),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmation'],
  });

@Component({
  selector: 'change-password',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputOtpModule,
  ],
  templateUrl: './change-password.html',
})
export class ChangePassword {
  private securityService = inject(SecurityService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authProvider = inject(AuthProvider);
  changeState = inject(HttpStateService);
  toast = inject(ToastService);

  screen = inject(Screen);
  form = this.formBuilder.group<Password & {confirmPassword: string}>({
    newPassword: '',
    confirmPassword: '',
    otpCode: '',
  });

  zodErrors = signal<Record<string, string | null>>({});

  async submit() {
    this.form.markAllAsTouched();

    const parsedValue = runZodValidation(
      this.form.value,
      passwordSchema,
      this.zodErrors
    );

    if (!parsedValue.success) return;
    await this.changeState.request({
      request: this.securityService.changePassword(
        parsedValue.data! as Password
      ),
      onSuccess: () => {
        this.toast.message('success', 'Mot de passe changé avec succès');
        this.authProvider.logout();
      },
    });
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
