import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MovieListPage } from './movie-list.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: MovieListPage }]),
  ],
  declarations: [MovieListPage],
})
export class MovieListPageModule {}
