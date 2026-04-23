import {AuthProvider} from '@/app/providers';
import {HttpStateService} from '@/app/services';
import {DEFAULT_LOGIN, runZodValidation, ToastService} from '@/app/utils';
import {Screen} from '@/app/utils/screen';
import {SecurityService, Signin} from '@aaajm/client';
import {signinSchema} from '@aaajm/client/zod';
import {HttpClient} from '@angular/common/http';
import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DividerModule} from 'primeng/divider';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {PopoverModule} from 'primeng/popover';
import {StepperModule} from 'primeng/stepper';

@Component({
  selector: 'login-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    PasswordModule,
    InputTextModule,
    CardModule,
    DividerModule,
    StepperModule,
    PopoverModule,
    InputGroupModule,
    AvatarModule,
  ],
  templateUrl: './login.html',
})
export class Login {
  private toast = inject(ToastService);
  private httpClient = inject(HttpClient);
  private securityService = inject(SecurityService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authProvider = inject(AuthProvider);
  loginState = inject(HttpStateService);
  whoamiState = inject(HttpStateService);
  sendEmailState = inject(HttpStateService);
  email = signal('');
  files = signal<File[]>([]);

  screen = inject(Screen);
  form = this.formBuilder.group<Signin>(DEFAULT_LOGIN);

  zodErrors = signal<Record<string, string | null>>({});

  async submit() {
    this.form.markAllAsTouched();

    const parsedValue = runZodValidation(
      this.form.value,
      signinSchema,
      this.zodErrors
    );

    if (!parsedValue.success) return;

    await this.loginState.request({
      request: this.securityService.signin(parsedValue.data),
      onSuccess: (token: string) => {
        //TODO: handle verify email
        this.authProvider.setToken({accessToken: token, refresshToken: ''});
        this.navigate('/authentication/verify-email');
      },
    });
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  async forgotPassword() {}
}
