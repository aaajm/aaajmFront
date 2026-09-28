import {Footer} from '@/app/components/footer';
import {AuthProvider} from '@/app/providers';
import {Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter, map, startWith} from 'rxjs/operators';
import {Navbar} from './navbar';
import {Sidebar} from './sidebar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Footer, Sidebar, Navbar],
  templateUrl: './layout.html',
})
export class Layout {
  authProvdier = inject(AuthProvider);
  private router = inject(Router);

  isContentPage = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url.startsWith('/content')),
      startWith(this.router.url.startsWith('/content'))
    ),
    {initialValue: this.router.url.startsWith('/content')}
  );

  contentLock = computed(() => this.isContentPage());
}
