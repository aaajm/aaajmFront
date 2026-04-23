import {Layout} from '@/app/components/layout';
import {HomePage} from '@/app/pages/home';
import {Routes} from '@angular/router';
import {NotFound} from './pages/not-found';
import {PartnerPage} from './pages/partner';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: '',
    component: Layout,
    children: [
      {path: 'home', component: HomePage},
      {path: 'partner', component: PartnerPage},
      {path: '**', component: NotFound},
    ],
  },
];
