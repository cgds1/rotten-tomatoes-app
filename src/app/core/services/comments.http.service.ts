import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICommentsService } from './interfaces/comments-service.interface';
import { Comment, CreateCommentRequest, UpdateCommentRequest, UserComment } from '../models/comment.model';
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

interface ApiUserComment {
  id: string;
  content: string;
  score: number;
  userId: string;
  movieId: string;
  createdAt: string;
  updatedAt: string;
  movie: {
    id: string;
    title: string;
    posterUrl: string;
  };
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

function mapUserComment(raw: ApiUserComment): UserComment {
  return {
    id: raw.id,
    content: raw.content,
    score: raw.score,
    user: { id: raw.userId, name: '', role: 'USER' },
    movieId: raw.movieId,
    createdAt: raw.createdAt,
    movie: {
      id: raw.movie.id,
      title: raw.movie.title,
      posterUrl: raw.movie.posterUrl,
    },
  };
}

@Injectable({ providedIn: 'root' })
export class CommentsHttpService implements ICommentsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByMovie(movieId: string): Observable<Comment[]> {
    return this.http.get<ApiComment[]>(`${this.baseUrl}/comments/movie/${movieId}`).pipe(
      map(comments => comments.map(mapComment)),
    );
  }

  getMyComments(): Observable<UserComment[]> {
    return this.http.get<ApiUserComment[]>(`${this.baseUrl}/comments/me`).pipe(
      map(comments => comments.map(mapUserComment)),
    );
  }

  create(movieId: string, data: CreateCommentRequest): Observable<Comment> {
    return this.http.post<ApiComment>(`${this.baseUrl}/comments`, {
      movieId,
      content: data.content,
      score: data.score,
    }).pipe(
      map(mapComment),
    );
  }

  update(commentId: string, data: UpdateCommentRequest): Observable<Comment> {
    return this.http.patch<ApiComment>(`${this.baseUrl}/comments/${commentId}`, data).pipe(
      map(mapComment),
    );
  }

  delete(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comments/${commentId}`);
  }
}
