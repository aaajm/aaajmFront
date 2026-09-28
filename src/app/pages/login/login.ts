import {AuthProvider} from '@/app/providers';
import {HttpStateService} from '@/app/services';
import {DEFAULT_LOGIN, runZodValidation} from '@/app/utils';
import {Screen} from '@/app/utils/screen';
import {SecurityService, Signin, Whoami} from '@aaajm/client';
import {signinSchema} from '@aaajm/client/zod';
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
import {firstValueFrom} from 'rxjs';

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
  private securityService = inject(SecurityService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authProvider = inject(AuthProvider);
  loginState = inject(HttpStateService);
  resetState = inject(HttpStateService);

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
      onSuccess: async (token: string) => {
        this.authProvider.setToken({accessToken: token, refresshToken: ''});
        try {
          const whoami: Whoami = await firstValueFrom(this.securityService.whoami());
          if (whoami?.user) {
            this.authProvider.setUser(whoami.user);
          }
        } catch (e) {
          console.error('Erreur lors de la récupération des infos utilisateur', e);
        }
        const redirectUrl = this.authProvider.redirectUrl;
        if (redirectUrl) {
          this.authProvider.redirectUrl = null;
          this.navigate(redirectUrl);
        } else if (this.authProvider.isAdmin()) {
          this.navigate('/user');
        } else {
          this.navigate('/home');
        }
      },
    });
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  async forgotPassword() {
    await this.resetState.request({
      request: this.securityService.resetPassword(this.form.value.email!),
      onSuccess: (token: string) => {
        this.authProvider.setToken({accessToken: token, refresshToken: ''});
        this.navigate('/change-password');
      },
    });
  }
}
