import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MovieSearchPage } from './movie-search.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: MovieSearchPage }]),
  ],
  declarations: [MovieSearchPage],
})
export class MovieSearchPageModule {}
