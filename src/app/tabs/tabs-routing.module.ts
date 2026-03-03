import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'movies',
        loadChildren: () =>
          import('../features/movies/movie-list/movie-list.module').then(
            (m) => m.MovieListPageModule
          ),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('../features/movies/movie-search/movie-search.module').then(
            (m) => m.MovieSearchPageModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../features/profile/my-profile/my-profile.module').then(
            (m) => m.MyProfilePageModule
          ),
      },
      {
        path: '',
        redirectTo: 'movies',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsRoutingModule {}
