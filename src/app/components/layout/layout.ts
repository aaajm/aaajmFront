import {Footer} from '@/app/components/footer';
import {Navbar} from '@/app/components/navbar';
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Navbar, RouterOutlet, Footer],
  templateUrl: './layout.html',
})
export class Layout {}
