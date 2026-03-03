import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title class="font-display">Iniciar Sesión</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p style="color: var(--text-secondary)">Próximamente</p>
    </ion-content>
  `,
  standalone: false,
})
export class LoginPage {}
