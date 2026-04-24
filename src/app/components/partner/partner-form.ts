import {HttpStateService} from '@/app/services';
import {DEFAULT_PARTNER, runZodValidation} from '@/app/utils';
import {Partner, PartnerService} from '@aaajm/client';
import {partnerSchema} from '@aaajm/client/zod';
import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputMaskModule} from 'primeng/inputmask';
import {InputTextModule} from 'primeng/inputtext';

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
  ],
  templateUrl: './partner-form.html',
})
export class PartnerForm {
  private formBuilder = inject(FormBuilder);
  private partnerService = inject(PartnerService);
  partnerForm = this.formBuilder.group<Partner>(DEFAULT_PARTNER as Partner);
  //TODO: add adress and logo
  submitPartnerState = inject(HttpStateService);
  zodErrors = signal<Record<string, string | null>>({});

  async submit() {
    this.partnerForm.markAllAsTouched();

    const parsedValue = runZodValidation(
      this.partnerForm.value,
      partnerSchema,
      this.zodErrors
    );

    await this.submitPartnerState.request({
      request: this.partnerService.addPartner(parsedValue.data!),
      onSuccess: () => console.log('Partner added logic'),
    });
  }
}
