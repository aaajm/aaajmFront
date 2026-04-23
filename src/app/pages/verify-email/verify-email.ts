import {AuthProvider} from '@/app/providers';
import {HttpStateService} from '@/app/services';
import {runZodValidation, ToastService} from '@/app/utils';
import {Screen} from '@/app/utils/screen';
import {SecurityService, Whoami} from '@aaajm/client';
import {Component, inject, input, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DividerModule} from 'primeng/divider';
import {InputOtpModule} from 'primeng/inputotp';
import z from 'zod';

const mfaSchema = z.object({
  code: z.string().min(5),
});

@Component({
  selector: 'verify-email',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputOtpModule,
    DividerModule,
  ],
  templateUrl: './verify-email.html',
})
export class VerifyEmail {
  token = input.required<string>();
  private redirectTo = signal('profile');
  private toast = inject(ToastService);
  securityService = inject(SecurityService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  screen = inject(Screen);
  private authProvider = inject(AuthProvider);

  mfaState = inject(HttpStateService);

  form = this.formBuilder.group<{code: string}>({
    code: '',
  });

  zodErrors = signal<Record<string, string | null>>({});

  async submit() {
    this.form.markAllAsTouched();

    const parsedValue = runZodValidation(
      this.form.value,
      mfaSchema,
      this.zodErrors
    );

    if (!parsedValue.success) return;

    await this.mfaState.request({
      request: this.securityService.emailVerification(parsedValue.data.code),
      onSuccess: (whoami: Whoami) => {
        this.authProvider.setToken({
          accessToken: whoami.bearer || '',
          refresshToken: '',
        });
        this.authProvider.setUser(whoami.user!);
        this.navigate('/home');
      },
    });
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
