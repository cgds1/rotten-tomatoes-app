import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  templateUrl: 'my-profile.page.html',
  styleUrls: ['my-profile.page.scss'],
  standalone: false,
})
export class MyProfilePage {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }
}
