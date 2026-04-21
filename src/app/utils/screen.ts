import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {inject, Injectable} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Injectable({providedIn: 'root'})
export class Screen {
  private breakpointObserver = inject(BreakpointObserver);
  isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait])
      .pipe(map((result) => result.matches)),
    {initialValue: false}
  );

  isDesktop = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Tablet])
      .pipe(map((result) => result.matches)),
    {initialValue: false}
  );
}
