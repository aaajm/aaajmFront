import {Footer} from '@/app/components/footer';
import {AuthProvider} from '@/app/providers';
import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navbar} from './navbar';
import {Sidebar} from './sidebar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Footer, Sidebar, Navbar],
  templateUrl: './layout.html',
})
export class Layout {
  authProvdier = inject(AuthProvider);
}
