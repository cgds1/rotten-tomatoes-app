import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { RatingBadgeComponent } from './components/rating-badge/rating-badge.component';
import { SkeletonCardComponent } from './components/skeleton-card/skeleton-card.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { CommentItemComponent } from './components/comment-item/comment-item.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';

@NgModule({
  declarations: [
    RatingBadgeComponent,
    SkeletonCardComponent,
    MovieCardComponent,
    CommentItemComponent,
    StarRatingComponent,
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
  ],
})
export class SharedModule {}
