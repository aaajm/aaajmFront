import {Layout} from '@/app/components/layout';
import {HomePage} from '@/app/pages/home';
import {Login} from '@/app/pages/login';
import {NotFound} from '@/app/pages/not-found';
import {PartnerPage} from '@/app/pages/partner';
import {VerifyEmail} from '@/app/pages/verify-email';
import {Routes} from '@angular/router';
import {ChangePassword} from './pages/change-password';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: '',
    component: Layout,
    children: [
      {path: 'home', component: HomePage},
      {path: 'authentication/signin', component: Login},
      {path: 'authentication/verify-email', component: VerifyEmail},
      {path: 'change-password', component: ChangePassword},
      {path: 'partner', component: PartnerPage},
      {path: '**', component: NotFound},
    ],
  },
];
