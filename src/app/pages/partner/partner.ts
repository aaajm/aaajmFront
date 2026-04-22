import {PartnerForm} from '@/app/components/partner';
import {Component} from '@angular/core';

@Component({
  selector: 'partner-page',
  standalone: true,
  templateUrl: './partner.html',
  imports: [PartnerForm],
})
export class PartnerPage {}
