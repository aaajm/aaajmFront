import {Layout} from '@/app/components/layout';
import {HomePage} from '@/app/pages/home';
import {Login} from '@/app/pages/login';
import {NotFound} from '@/app/pages/not-found';
import {PartnerPage} from '@/app/pages/partner';
import {TopicPage} from '@/app/pages/topic';
import {VerifyEmail} from '@/app/pages/verify-email';
import {Routes} from '@angular/router';
import {TopicForm} from './components/topic';
import {ChangePassword} from './pages/change-password';
import {MemberPage} from './pages/member';

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
      {path: 'topic/:topicId', component: TopicPage},
      {path: 'topic-form', component: TopicForm},
      {path: 'member', component: MemberPage},
      {path: '**', component: NotFound},
    ],
  },
];
