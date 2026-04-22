import {Layout} from '@/app/components/layout';
import {Routes} from '@angular/router';
import {HomePage} from '@/app/pages/home';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: '',
    component: Layout,
    children: [{path: 'home', component: HomePage}],
  },
];
