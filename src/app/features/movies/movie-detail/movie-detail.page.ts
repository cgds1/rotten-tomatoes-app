import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { MovieDetail } from '../../../core/models/movie.model';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../../../core/models/comment.model';
import { IMoviesService } from '../../../core/services/interfaces/movies-service.interface';
import { ICommentsService } from '../../../core/services/interfaces/comments-service.interface';
import { MOVIES_SERVICE, COMMENTS_SERVICE } from '../../../core/services/service-tokens';
import { AuthService } from '../../../core/services/auth.service';
import { CommentFormComponent } from '../../comments/comment-form/comment-form.component';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
  standalone: false,
})
export class MovieDetailPage implements OnInit {
  movie: MovieDetail | null = null;
  comments: Comment[] = [];
  loading = true;
  synopsisExpanded = false;

  get currentUserId(): string {
    return this.authService.currentUser?.id || '';
  }

  get userComment(): Comment | undefined {
    return this.comments.find(c => c.user.id === this.currentUserId);
  }

  get releaseYear(): string {
    return this.movie?.releaseDate?.substring(0, 4) || '';
  }

  get runtimeFormatted(): string {
    if (!this.movie?.runtime) return '';
    const h = Math.floor(this.movie.runtime / 60);
    const m = this.movie.runtime % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  }

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    @Inject(MOVIES_SERVICE) private moviesService: IMoviesService,
    @Inject(COMMENTS_SERVICE) private commentsService: ICommentsService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadMovie(id);
  }

  goBack(): void {
    this.navCtrl.back();
  }

  toggleSynopsis(): void {
    this.synopsisExpanded = !this.synopsisExpanded;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  async openCommentForm(existing?: Comment): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CommentFormComponent,
      componentProps: {
        movieId: this.movie!.id,
        existingComment: existing,
      },
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'create' && data) {
      await this.createComment(data);
    } else if (role === 'edit' && data) {
      await this.updateComment(data.commentId, { score: data.score, content: data.content });
    }
  }

  async onEditComment(comment: Comment): Promise<void> {
    await this.openCommentForm(comment);
  }

  async onDeleteComment(comment: Comment): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar reseña',
      message: '¿Estás seguro de que quieres eliminar tu reseña?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.deleteComment(comment),
        },
      ],
    });
    await alert.present();
  }

  trackByCommentId(_index: number, comment: Comment): string {
    return comment.id;
  }

  private loadMovie(id: string): void {
    this.loading = true;
    this.moviesService.getMovieDetail(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.comments = movie.comments || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private async createComment(data: CreateCommentRequest): Promise<void> {
    const user = this.authService.currentUser!;
    const tempId = `temp_${Date.now()}`;
    const optimisticComment: Comment = {
      id: tempId,
      content: data.content,
      score: data.score,
      user: { id: user.id, name: user.name, role: user.role },
      movieId: this.movie!.id,
      createdAt: new Date().toISOString(),
    };

    // Optimistic: add immediately
    this.comments = [...this.comments, optimisticComment];
    this.recalculateLocalRatings();

    this.commentsService.create(this.movie!.id, data).subscribe({
      next: (real) => {
        // Replace temp with real
        this.comments = this.comments.map(c => c.id === tempId ? real : c);
      },
      error: async () => {
        // Revert
        this.comments = this.comments.filter(c => c.id !== tempId);
        this.recalculateLocalRatings();
        await this.showToast('Error al publicar la reseña', 'danger');
      },
    });
  }

  private async updateComment(commentId: string, data: UpdateCommentRequest): Promise<void> {
    const snapshot = this.comments.find(c => c.id === commentId);
    if (!snapshot) return;

    // Optimistic: update immediately
    this.comments = this.comments.map(c =>
      c.id === commentId
        ? { ...c, ...(data.content != null && { content: data.content }), ...(data.score != null && { score: data.score }) }
        : c
    );
    this.recalculateLocalRatings();

    this.commentsService.update(commentId, data).subscribe({
      next: (updated) => {
        this.comments = this.comments.map(c => c.id === commentId ? updated : c);
      },
      error: async () => {
        // Revert
        this.comments = this.comments.map(c => c.id === commentId ? snapshot : c);
        this.recalculateLocalRatings();
        await this.showToast('Error al actualizar la reseña', 'danger');
      },
    });
  }

  private async deleteComment(comment: Comment): Promise<void> {
    // Optimistic: remove immediately
    this.comments = this.comments.filter(c => c.id !== comment.id);
    this.recalculateLocalRatings();

    this.commentsService.delete(comment.id).subscribe({
      next: async () => {
        await this.showToast('Reseña eliminada', 'success');
      },
      error: async () => {
        // Revert
        this.comments = [...this.comments, comment];
        this.recalculateLocalRatings();
        await this.showToast('Error al eliminar la reseña', 'danger');
      },
    });
  }

  private recalculateLocalRatings(): void {
    if (!this.movie) return;
    const userScores = this.comments.filter(c => c.user.role === 'USER').map(c => c.score);
    const criticScores = this.comments.filter(c => c.user.role === 'CRITIC').map(c => c.score);

    this.movie = {
      ...this.movie,
      userRating: userScores.length > 0
        ? Math.round((userScores.reduce((a, b) => a + b, 0) / userScores.length) * 10) / 10
        : 0,
      criticRating: criticScores.length > 0
        ? Math.round((criticScores.reduce((a, b) => a + b, 0) / criticScores.length) * 10) / 10
        : 0,
      userRatingCount: userScores.length,
      criticRatingCount: criticScores.length,
    };
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
