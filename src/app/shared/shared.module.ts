import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { RatingBadgeComponent } from './components/rating-badge/rating-badge.component';
import { SkeletonCardComponent } from './components/skeleton-card/skeleton-card.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { CommentItemComponent } from './components/comment-item/comment-item.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ErrorStateComponent } from './components/error-state/error-state.component';
import { SkeletonDetailComponent } from './components/skeleton-detail/skeleton-detail.component';
import { SkeletonCommentComponent } from './components/skeleton-comment/skeleton-comment.component';
import { SkeletonProfileComponent } from './components/skeleton-profile/skeleton-profile.component';

@NgModule({
  declarations: [
    RatingBadgeComponent,
    SkeletonCardComponent,
    MovieCardComponent,
    CommentItemComponent,
    StarRatingComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    SkeletonDetailComponent,
    SkeletonCommentComponent,
    SkeletonProfileComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    RatingBadgeComponent,
    SkeletonCardComponent,
    MovieCardComponent,
    CommentItemComponent,
    StarRatingComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    SkeletonDetailComponent,
    SkeletonCommentComponent,
    SkeletonProfileComponent,
  ],
})
export class SharedModule {}
