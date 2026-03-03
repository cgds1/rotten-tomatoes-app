import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { AUTH_SERVICE, MOVIES_SERVICE, COMMENTS_SERVICE } from './core/services/service-tokens';
import { AuthMockService } from './core/services/auth.mock.service';
import { MoviesMockService } from './core/services/movies.mock.service';
import { CommentsMockService } from './core/services/comments.mock.service';

const serviceProviders = environment.useMocks
  ? [
      { provide: AUTH_SERVICE, useClass: AuthMockService },
      { provide: MOVIES_SERVICE, useClass: MoviesMockService },
      { provide: COMMENTS_SERVICE, useClass: CommentsMockService },
    ]
  : [
      // TODO: HTTP service implementations for production
    ];

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
    ...serviceProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
