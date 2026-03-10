import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  async ngOnInit(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      setTimeout(async () => {
        try {
          await SplashScreen.hide({ fadeOutDuration: 500 });
        } catch {
          // Splash screen might not be available, continue anyway
        }
      }, 1500);
    }
  }
}
