import {HttpStateService} from '@/app/services';
import {
  DEFAULT_PARTNER,
  newId,
  runZodValidation,
  ToastService,
} from '@/app/utils';
import {Partner, PartnerService} from '@aaajm/client';
import {partnerSchema} from '@aaajm/client/zod';
import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputMaskModule} from 'primeng/inputmask';
import {InputTextModule} from 'primeng/inputtext';
import {Fileupload} from '../file-upload';

@Component({
  selector: 'partner-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputMaskModule,
    InputTextModule,
    InputGroupModule,
    Button,
    Fileupload,
  ],
  templateUrl: './partner-form.html',
})
export class PartnerForm {
  private formBuilder = inject(FormBuilder);
  private partnerService = inject(PartnerService);
  toast = inject(ToastService);
  partnerForm = this.formBuilder.group<Partner>(DEFAULT_PARTNER());
  submitPartnerState = inject(HttpStateService);
  zodErrors = signal<Record<string, string | null>>({});
  logoFile = signal<File | null>(null);

  onSelectLogo(files: File[]) {
    if (files && files.length > 0)
      this.logoFile.set(new File([files[0]], newId()));
  }

  async submit() {
    this.partnerForm.markAllAsTouched();

    const parsedValue = runZodValidation(
      this.partnerForm.value,
      partnerSchema,
      this.zodErrors
    );

    if (!parsedValue.success) return;

    await this.submitPartnerState.request({
      request: this.partnerService.addPartner(
        parsedValue.data! as Partner,
        this.logoFile() ? this.logoFile()! : undefined
      ),
      onSuccess: () => {
        this.toast.message('success', 'Votre requête est envoyé.');
        this.toast.message('success', 'On reviendra vers vous.');
        this.partnerForm.reset(DEFAULT_PARTNER());
      },
    });
  }
}
