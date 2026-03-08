import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skeleton-profile',
  templateUrl: './skeleton-profile.component.html',
  styleUrls: ['./skeleton-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkeletonProfileComponent {}
