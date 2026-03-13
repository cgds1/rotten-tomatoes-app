import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ICommentsService } from './interfaces/comments-service.interface';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../models/comment.model';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

interface ApiComment {
  id: string;
  content: string;
  score: number;
  userId: string;
  movieId: string;
  createdAt: string;
  updatedAt: string;
  user: { name: string; role: 'USER' | 'CRITIC' };
}

function mapComment(raw: ApiComment): Comment {
  return {
    id: raw.id,
    content: raw.content,
    score: raw.score,
    user: { id: raw.userId, name: raw.user.name, role: raw.user.role },
    movieId: raw.movieId,
    createdAt: raw.createdAt,
  };
}

const USER_COMMENTS_KEY = 'user_comments_cache';

@Injectable({ providedIn: 'root' })
export class CommentsHttpService implements ICommentsService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) {}

  getByMovie(movieId: string): Observable<Comment[]> {
    return this.http.get<ApiComment[]>(`${this.baseUrl}/comments/movie/${movieId}`).pipe(
      map(comments => comments.map(mapComment)),
    );
  }

  getByUser(_userId: string): Observable<Comment[]> {
    // The API doesn't have a dedicated endpoint for user comments.
    // Return cached comments from local storage (populated on create/update/delete).
    return new Observable(subscriber => {
      this.storage.get<Comment[]>(USER_COMMENTS_KEY).then(cached => {
        subscriber.next(cached || []);
        subscriber.complete();
      }).catch(() => {
        subscriber.next([]);
        subscriber.complete();
      });
    });
  }

  create(movieId: string, data: CreateCommentRequest): Observable<Comment> {
    return this.http.post<ApiComment>(`${this.baseUrl}/comments`, {
      movieId,
      content: data.content,
      score: data.score,
    }).pipe(
      map(mapComment),
      tap(comment => this.addToCache(comment)),
    );
  }

  update(commentId: string, data: UpdateCommentRequest): Observable<Comment> {
    return this.http.patch<ApiComment>(`${this.baseUrl}/comments/${commentId}`, data).pipe(
      map(mapComment),
      tap(comment => this.updateInCache(comment)),
    );
  }

  delete(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comments/${commentId}`).pipe(
      tap(() => this.removeFromCache(commentId)),
    );
  }

  private async addToCache(comment: Comment): Promise<void> {
    const cached = (await this.storage.get<Comment[]>(USER_COMMENTS_KEY)) || [];
    cached.push(comment);
    await this.storage.set(USER_COMMENTS_KEY, cached);
  }

  private async updateInCache(comment: Comment): Promise<void> {
    const cached = (await this.storage.get<Comment[]>(USER_COMMENTS_KEY)) || [];
    const index = cached.findIndex(c => c.id === comment.id);
    if (index !== -1) {
      cached[index] = comment;
    }
    await this.storage.set(USER_COMMENTS_KEY, cached);
  }

  private async removeFromCache(commentId: string): Promise<void> {
    const cached = (await this.storage.get<Comment[]>(USER_COMMENTS_KEY)) || [];
    await this.storage.set(USER_COMMENTS_KEY, cached.filter(c => c.id !== commentId));
  }

  /** Call this on logout to clear cached user comments */
  async clearCache(): Promise<void> {
    await this.storage.remove(USER_COMMENTS_KEY);
  }
}
