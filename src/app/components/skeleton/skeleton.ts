import {Component} from '@angular/core';
import {SkeletonModule} from 'primeng/skeleton';

@Component({
  selector: 'app-skeleton',
  imports: [SkeletonModule],
  templateUrl: './skeleton.html',
})
export class Skeleton {}
