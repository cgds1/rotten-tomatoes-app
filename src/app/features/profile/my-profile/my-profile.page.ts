import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ICommentsService } from '../../../core/services/interfaces/comments-service.interface';
import { COMMENTS_SERVICE } from '../../../core/services/service-tokens';
import { Comment } from '../../../core/models/comment.model';
import { MOCK_MOVIES } from '../../../core/mocks/mock-movies';
import { MoviesState } from '../../../state/movies.state';

export interface UserReview {
  comment: Comment;
  movieTitle: string;
  moviePoster: string;
}

@Component({
  selector: 'app-my-profile',
  templateUrl: 'my-profile.page.html',
  styleUrls: ['my-profile.page.scss'],
  standalone: false,
})
export class MyProfilePage implements OnInit {
  loading = true;
  reviews: UserReview[] = [];
  reviewCount = 0;
  averageScore = 0;
  animatedReviewCount = 0;
  animatedAverageScore = 0;

  constructor(
    public authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private moviesState: MoviesState,
    @Inject(COMMENTS_SERVICE) private commentsService: ICommentsService,
  ) {}

  ngOnInit() {
    this.loadUserReviews();
  }

  ionViewWillEnter() {
    this.loadUserReviews();
  }

  get user() {
    return this.authService.currentUser;
  }

  get initials(): string {
    if (!this.user) return '';
    return this.user.name
      .split(' ')
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  get avatarColor(): string {
    if (!this.user) return '#6E9CC8';
    let hash = 0;
    for (let i = 0; i < this.user.name.length; i++) {
      hash = this.user.name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 45%, 40%)`;
  }

  async loadUserReviews() {
    if (!this.user) return;
    this.loading = true;

    try {
      const comments = await firstValueFrom(this.commentsService.getByUser(this.user.id));
      this.reviews = comments.map(c => {
        const movie = MOCK_MOVIES.find(m => m.id === c.movieId);
        return {
          comment: c,
          movieTitle: movie?.title ?? 'Película desconocida',
          moviePoster: movie?.posterUrl ?? '',
        };
      });
      this.reviewCount = this.reviews.length;
      this.averageScore = this.reviewCount > 0
        ? Math.round((comments.reduce((sum, c) => sum + c.score, 0) / this.reviewCount) * 10) / 10
        : 0;

      this.animateCountUp();
    } catch {
      this.reviews = [];
      this.reviewCount = 0;
      this.averageScore = 0;
    } finally {
      this.loading = false;
    }
  }

  private animateCountUp() {
    this.animatedReviewCount = 0;
    this.animatedAverageScore = 0;

    const duration = 800;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = this.easeOutCubic(step / steps);
      this.animatedReviewCount = Math.round(progress * this.reviewCount);
      this.animatedAverageScore = Math.round(progress * this.averageScore * 10) / 10;

      if (step >= steps) {
        this.animatedReviewCount = this.reviewCount;
        this.animatedAverageScore = this.averageScore;
        clearInterval(timer);
      }
    }, interval);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  getScoreColor(score: number): string {
    if (score >= 8) return 'var(--color-success)';
    if (score >= 5) return 'var(--color-critic)';
    return 'var(--color-danger)';
  }

  goToMovie(movieId: string) {
    this.router.navigateByUrl(`/movies/${movieId}`);
  }

  goToEditProfile() {
    this.router.navigateByUrl('/tabs/profile/edit');
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro que querés cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cerrar sesión',
          role: 'destructive',
          handler: () => this.performLogout(),
        },
      ],
    });
    await alert.present();
  }

  private async performLogout() {
    await this.authService.logout();
    this.moviesState.loadMovies();
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }

  async confirmDeleteAccount() {
    const alert1 = await this.alertController.create({
      header: 'Eliminar cuenta',
      message: '¿Estás seguro? Se eliminarán todos tus datos y reseñas.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Continuar',
          cssClass: 'alert-danger-button',
          handler: () => this.showDeleteConfirmation(),
        },
      ],
    });
    await alert1.present();
  }

  private async showDeleteConfirmation() {
    const alert2 = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: 'Esta acción es irreversible. Escribí ELIMINAR para confirmar.',
      inputs: [
        {
          name: 'confirmation',
          type: 'text',
          placeholder: 'Escribí ELIMINAR',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar cuenta',
          cssClass: 'alert-danger-button',
          handler: (data) => {
            if (data.confirmation === 'ELIMINAR') {
              this.performDeleteAccount();
              return true;
            }
            return false;
          },
        },
      ],
    });
    await alert2.present();
  }

  private async performDeleteAccount() {
    try {
      await this.authService.deleteAccount();
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });

      const toast = await this.toastController.create({
        message: 'Tu cuenta ha sido eliminada',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    } catch {
      const toast = await this.toastController.create({
        message: 'Error al eliminar la cuenta',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
  }
}
