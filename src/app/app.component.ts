import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  async ngOnInit(): Promise<void> {
    setTimeout(async () => {
      await SplashScreen.hide({ fadeOutDuration: 500 });
    }, 1500);
  }
}
