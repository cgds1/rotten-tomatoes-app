import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { RatingBadgeComponent } from './components/rating-badge/rating-badge.component';
import { SkeletonCardComponent } from './components/skeleton-card/skeleton-card.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';

@NgModule({
  declarations: [
    RatingBadgeComponent,
    SkeletonCardComponent,
    MovieCardComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    RatingBadgeComponent,
    SkeletonCardComponent,
    MovieCardComponent,
  ],
})
export class SharedModule {}
