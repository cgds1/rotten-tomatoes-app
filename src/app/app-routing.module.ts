import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [authGuard],
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('./features/onboarding/onboarding.module').then(
        (m) => m.OnboardingPageModule
      ),
  },
  {
    path: 'auth/login',
    loadChildren: () =>
      import('./features/auth/login/login.module').then(
        (m) => m.LoginPageModule
      ),
    canActivate: [guestGuard],
  },
  {
    path: 'auth/register',
    loadChildren: () =>
      import('./features/auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
    canActivate: [guestGuard],
  },
  {
    path: 'movies/:id',
    loadChildren: () =>
      import('./features/movies/movie-detail/movie-detail.module').then(
        (m) => m.MovieDetailPageModule
      ),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
