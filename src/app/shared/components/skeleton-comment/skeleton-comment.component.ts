import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skeleton-comment',
  templateUrl: './skeleton-comment.component.html',
  styleUrls: ['./skeleton-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkeletonCommentComponent {}
