import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MovieDetailPage } from './movie-detail.page';
import { SharedModule } from '../../../shared/shared.module';
import { CommentFormModule } from '../../comments/comment-form/comment-form.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    CommentFormModule,
    RouterModule.forChild([{ path: '', component: MovieDetailPage }]),
  ],
  declarations: [MovieDetailPage],
})
export class MovieDetailPageModule {}
