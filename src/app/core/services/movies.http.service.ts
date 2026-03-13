import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IMoviesService } from './interfaces/movies-service.interface';
import { Movie, MovieDetail, MovieFilter, PaginatedResponse } from '../models/movie.model';
import { environment } from '../../../environments/environment';

interface ApiMovieCategory {
  category: { id: number; name: string };
}

interface ApiMovie {
  id: string;
  tmdbId: number;
  title: string;
  synopsis: string | null;
  releaseDate: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  runtime: number | null;
  userRating: number;
  criticRating: number;
  popularity: number;
  categories: ApiMovieCategory[];
}

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

interface ApiCastMember {
  name: string;
  character: string;
  profileUrl: string | null;
}

interface ApiMovieDetail extends ApiMovie {
  comments: ApiComment[];
  cast: ApiCastMember[];
}

interface ApiPaginatedResponse {
  data: ApiMovie[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

function mapMovie(raw: ApiMovie): Movie {
  return {
    id: raw.id,
    tmdbId: raw.tmdbId,
    title: raw.title,
    synopsis: raw.synopsis ?? '',
    releaseDate: raw.releaseDate ?? '',
    posterUrl: raw.posterUrl ?? '',
    backdropUrl: raw.backdropUrl ?? '',
    runtime: raw.runtime ?? 0,
    userRating: raw.userRating,
    criticRating: raw.criticRating,
    categories: raw.categories.map(c => c.category),
  };
}

function mapComment(raw: ApiComment) {
  return {
    id: raw.id,
    content: raw.content,
    score: raw.score,
    user: { id: raw.userId, name: raw.user.name, role: raw.user.role },
    movieId: raw.movieId,
    createdAt: raw.createdAt,
  };
}

function mapMovieDetail(raw: ApiMovieDetail): MovieDetail {
  const comments = (raw.comments || []).map(mapComment);
  const userComments = comments.filter(c => c.user.role === 'USER');
  const criticComments = comments.filter(c => c.user.role === 'CRITIC');

  return {
    ...mapMovie(raw),
    cast: (raw.cast || []).map(c => ({
      name: c.name,
      character: c.character,
      profileUrl: c.profileUrl,
    })),
    comments,
    userRatingCount: userComments.length,
    criticRatingCount: criticComments.length,
  };
}

@Injectable({ providedIn: 'root' })
export class MoviesHttpService implements IMoviesService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMovies(filters: MovieFilter): Observable<PaginatedResponse<Movie>> {
    let params = new HttpParams();

    if (filters.search) params = params.set('search', filters.search);
    if (filters.categories?.length) {
      for (const cat of filters.categories) {
        params = params.append('categories', cat.toString());
      }
    }
    if (filters.releaseDateFrom) params = params.set('releaseDateFrom', filters.releaseDateFrom);
    if (filters.releaseDateTo) params = params.set('releaseDateTo', filters.releaseDateTo);
    if (filters.minUserRating != null) params = params.set('minUserRating', filters.minUserRating.toString());
    if (filters.minCriticRating != null) params = params.set('minCriticRating', filters.minCriticRating.toString());
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<ApiPaginatedResponse>(`${this.baseUrl}/movies`, { params }).pipe(
      map(res => ({
        data: res.data.map(mapMovie),
        total: res.meta.total,
        page: res.meta.page,
        limit: res.meta.limit,
      })),
    );
  }

  searchMovies(query: string): Observable<Movie[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ApiMovie[]>(`${this.baseUrl}/movies/search`, { params }).pipe(
      map(movies => movies.map(mapMovie)),
    );
  }

  getMovieDetail(id: string): Observable<MovieDetail> {
    return this.http.get<ApiMovieDetail>(`${this.baseUrl}/movies/${id}`).pipe(
      map(mapMovieDetail),
    );
  }
}
