import {Layout} from '@/app/components/layout';
import {HomePage} from '@/app/pages/home';
import {Login} from '@/app/pages/login';
import {NotFound} from '@/app/pages/not-found';
import {PartnerPage} from '@/app/pages/partner';
import {ProfilePage} from '@/app/pages/profile';
import {TopicManage, TopicPage, TopicSummaryPage} from '@/app/pages/topic';
import {VerifyEmail} from '@/app/pages/verify-email';
import {AdminGuard} from '@/app/utils';
import {Routes} from '@angular/router';
import {ChangePassword} from './pages/change-password';
import {MemberPage} from './pages/member';
import {UserPage} from './pages/user';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: '',
    component: Layout,
    children: [
      {path: 'home', component: HomePage},
      {path: 'profile', component: ProfilePage},
      {path: 'authentication/signin', component: Login},
      {path: 'authentication/verify-email', component: VerifyEmail},
      {path: 'change-password', component: ChangePassword},
      {path: 'partner', component: PartnerPage},
      {
        path: 'album',
        loadComponent: () => import('./pages/photos').then((m) => m.PhotosPage),
      },
      {path: 'content/:topicId', component: TopicPage},
      {path: 'topic', component: TopicManage, canActivate: [AdminGuard]},
      {path: 'user', component: UserPage, canActivate: [AdminGuard]},
      {path: 'content', component: TopicSummaryPage},
      {path: 'member', component: MemberPage},
      {path: '**', component: NotFound},
    ],
  },
];
