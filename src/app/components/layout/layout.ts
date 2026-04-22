import {Navbar} from '@/app/components/navbar';
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Navbar, RouterOutlet],
  templateUrl: './layout.html',
})
export class Layout {}
