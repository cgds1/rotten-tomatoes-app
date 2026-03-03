import { Component } from '@angular/core';

@Component({
  selector: 'app-movie-detail',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/movies"></ion-back-button>
        </ion-buttons>
        <ion-title class="font-display">Detalle</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p style="color: var(--text-secondary)">Próximamente</p>
    </ion-content>
  `,
  standalone: false,
})
export class MovieDetailPage {}
