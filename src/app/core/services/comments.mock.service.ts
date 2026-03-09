import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ICommentsService } from './interfaces/comments-service.interface';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../models/comment.model';
import { MOCK_COMMENTS } from '../mocks/mock-comments';
import { MOCK_MOVIES, MockMovieData } from '../mocks/mock-movies';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

const MOCK_DELAY = 800;

@Injectable({ providedIn: 'root' })
export class CommentsMockService implements ICommentsService {
  comments: Comment[] = [...MOCK_COMMENTS];
  private movies: MockMovieData[] = MOCK_MOVIES.map(m => ({ ...m }));

  constructor(private authService: AuthService) {}

  getByMovie(movieId: string): Observable<Comment[]> {
    if (environment.mockError) {
      return throwError(() => new Error('Error simulado')).pipe(delay(MOCK_DELAY));
    }

    if (environment.mockEmpty) {
      return of([]).pipe(delay(MOCK_DELAY));
    }

    const result = this.comments.filter(c => c.movieId === movieId);
    return of(result).pipe(delay(MOCK_DELAY));
  }

  getByUser(userId: string): Observable<Comment[]> {
    const result = this.comments.filter(c => c.user.id === userId);
    return of(result).pipe(delay(MOCK_DELAY));
  }

  create(movieId: string, data: CreateCommentRequest): Observable<Comment> {
    const user = this.authService.currentUser;
    if (!user) {
      return throwError(() => new Error('No hay sesión activa'));
    }

    const existing = this.comments.find(
      c => c.movieId === movieId && c.user.id === user.id
    );
    if (existing) {
      return throwError(() => new Error('Ya tienes un comentario en esta película'));
    }

    const comment: Comment = {
      id: `c${Date.now()}`,
      content: data.content,
      score: data.score,
      user: { id: user.id, name: user.name, role: user.role },
      movieId,
      createdAt: new Date().toISOString(),
    };

    this.comments.push(comment);
    this.recalculateRatings(movieId);
    return of(comment).pipe(delay(MOCK_DELAY));
  }

  update(commentId: string, data: UpdateCommentRequest): Observable<Comment> {
    const index = this.comments.findIndex(c => c.id === commentId);
    if (index === -1) {
      return throwError(() => new Error('Comentario no encontrado'));
    }

    const comment = this.comments[index];
    const updated: Comment = {
      ...comment,
      ...(data.content != null && { content: data.content }),
      ...(data.score != null && { score: data.score }),
    };

    this.comments[index] = updated;
    this.recalculateRatings(comment.movieId);
    return of(updated).pipe(delay(MOCK_DELAY));
  }

  delete(commentId: string): Observable<void> {
    const index = this.comments.findIndex(c => c.id === commentId);
    if (index === -1) {
      return throwError(() => new Error('Comentario no encontrado'));
    }

    const movieId = this.comments[index].movieId;
    this.comments.splice(index, 1);
    this.recalculateRatings(movieId);
    return of(void 0).pipe(delay(MOCK_DELAY));
  }

  private recalculateRatings(movieId: string): void {
    const movie = this.movies.find(m => m.id === movieId);
    if (!movie) return;

    const movieComments = this.comments.filter(c => c.movieId === movieId);
    const userScores = movieComments.filter(c => c.user.role === 'USER').map(c => c.score);
    const criticScores = movieComments.filter(c => c.user.role === 'CRITIC').map(c => c.score);

    movie.userRating = userScores.length > 0
      ? Math.round((userScores.reduce((a, b) => a + b, 0) / userScores.length) * 10) / 10
      : 0;
    movie.criticRating = criticScores.length > 0
      ? Math.round((criticScores.reduce((a, b) => a + b, 0) / criticScores.length) * 10) / 10
      : 0;
  }
}
