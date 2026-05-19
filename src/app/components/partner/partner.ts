import {Partner as PartnerData} from '@aaajm/client';
import {Component, signal} from '@angular/core';
import {CarouselModule} from 'primeng/carousel';

@Component({
  selector: 'app-partner',
  imports: [CarouselModule],
  templateUrl: './partner.html',
})
export class Partner {
  asPartner(val: any) {
    return val as PartnerData;
  }
  partners = signal<PartnerData[]>([
    {
      id: 'p1',
      name: 'DGI Madagascar',
      email: '',
      phone: '',
      address: '',
      reason: '',
      logo: 'https://www.impots.mg/assets/img/logo/LOGO_DGI_OK.png',
    },
    {
      id: 'p2',
      name: 'AAAJM',
      email: '',
      phone: '',
      address: '',
      reason: '',
      logo: 'http',
    },
    {
      id: 'p1',
      name: 'DGI Madagascar',
      email: '',
      phone: '',
      address: '',
      reason: '',
      logo: 'https://www.impots.mg/assets/img/logo/LOGO_DGI_OK.png',
    },
    {
      id: 'p2',
      name: 'AAAJM',
      email: '',
      phone: '',
      address: '',
      reason: '',
      logo: 'http',
    },
    {
      id: 'p1',
      name: 'DGI Madagascar',
      email: '',
      phone: '',
      address: '',
      reason: '',
      logo: 'https://www.impots.mg/assets/img/logo/LOGO_DGI_OK.png',
    },
    {
      id: 'p2',
      name: 'AAAJM',
      email: '',
      phone: '',
      address: '',
      reason: '',
      logo: 'http',
    },
  ]);
}
