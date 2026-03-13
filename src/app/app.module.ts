import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AUTH_SERVICE, MOVIES_SERVICE, COMMENTS_SERVICE } from './core/services/service-tokens';
import { AuthHttpService } from './core/services/auth.http.service';
import { MoviesHttpService } from './core/services/movies.http.service';
import { CommentsHttpService } from './core/services/comments.http.service';
import { AuthService } from './core/services/auth.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

function initAuth(auth: AuthService) {
  return () => auth.loadSession();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: AUTH_SERVICE, useClass: AuthHttpService },
    { provide: MOVIES_SERVICE, useClass: MoviesHttpService },
    { provide: COMMENTS_SERVICE, useClass: CommentsHttpService },
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
