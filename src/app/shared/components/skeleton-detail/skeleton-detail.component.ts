import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skeleton-detail',
  templateUrl: './skeleton-detail.component.html',
  styleUrls: ['./skeleton-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkeletonDetailComponent {}
