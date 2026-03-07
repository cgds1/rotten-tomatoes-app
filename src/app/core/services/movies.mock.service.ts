import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IMoviesService } from './interfaces/movies-service.interface';
import { Movie, MovieDetail, MovieFilter, PaginatedResponse } from '../models/movie.model';
import { MOCK_MOVIES, MockMovieData } from '../mocks/mock-movies';
import { MOCK_COMMENTS } from '../mocks/mock-comments';

@Injectable({ providedIn: 'root' })
export class MoviesMockService implements IMoviesService {
  private movies: MockMovieData[] = MOCK_MOVIES.map(m => ({ ...m }));

  constructor() {
    this.recalculateAllRatings();
  }

  private recalculateAllRatings(): void {
    for (const movie of this.movies) {
      const comments = MOCK_COMMENTS.filter(c => c.movieId === movie.id);
      const userScores = comments.filter(c => c.user.role === 'USER').map(c => c.score);
      const criticScores = comments.filter(c => c.user.role === 'CRITIC').map(c => c.score);

      if (userScores.length > 0) {
        movie.userRating = Math.round((userScores.reduce((a, b) => a + b, 0) / userScores.length) * 10) / 10;
      }
      if (criticScores.length > 0) {
        movie.criticRating = Math.round((criticScores.reduce((a, b) => a + b, 0) / criticScores.length) * 10) / 10;
      }
    }
  }

  getMovies(filters: MovieFilter): Observable<PaginatedResponse<Movie>> {
    let result = [...this.movies];

    // Filter by search
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(m => m.title.toLowerCase().includes(query));
    }

    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(m =>
        m.categories.some(c => filters.categories!.includes(c.id))
      );
    }

    // Filter by release date range
    if (filters.releaseDateFrom) {
      result = result.filter(m => m.releaseDate >= filters.releaseDateFrom!);
    }
    if (filters.releaseDateTo) {
      result = result.filter(m => m.releaseDate <= filters.releaseDateTo!);
    }

    // Filter by minimum ratings
    if (filters.minUserRating != null) {
      result = result.filter(m => m.userRating >= filters.minUserRating!);
    }
    if (filters.minCriticRating != null) {
      result = result.filter(m => m.criticRating >= filters.minCriticRating!);
    }

    // Sorting
    const sortBy = filters.sortBy || 'releaseDate';
    const sortOrder = filters.sortOrder || 'desc';
    result.sort((a, b) => {
      const aVal = a[sortBy] as number | string;
      const bVal = b[sortBy] as number | string;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const total = result.length;
    const start = (page - 1) * limit;
    const paged = result.slice(start, start + limit);

    // Strip cast from list results
    const data: Movie[] = paged.map(({ cast, ...movie }) => movie);

    return of({ data, total, page, limit }).pipe(delay(150));
  }

  searchMovies(query: string): Observable<Movie[]> {
    const q = query.toLowerCase();
    const results = this.movies
      .filter(m => m.title.toLowerCase().includes(q))
      .map(({ cast, ...movie }) => movie);
    return of(results).pipe(delay(150));
  }

  getMovieDetail(id: string): Observable<MovieDetail> {
    const movie = this.movies.find(m => m.id === id);
    if (!movie) {
      throw new Error(`Película no encontrada: ${id}`);
    }

    const comments = MOCK_COMMENTS.filter(c => c.movieId === id);
    const userComments = comments.filter(c => c.user.role === 'USER');
    const criticComments = comments.filter(c => c.user.role === 'CRITIC');

    const userScores = userComments.map(c => c.score);
    const criticScores = criticComments.map(c => c.score);

    const detail: MovieDetail = {
      ...movie,
      comments,
      userRating: userScores.length > 0
        ? Math.round((userScores.reduce((a, b) => a + b, 0) / userScores.length) * 10) / 10
        : 0,
      criticRating: criticScores.length > 0
        ? Math.round((criticScores.reduce((a, b) => a + b, 0) / criticScores.length) * 10) / 10
        : 0,
      userRatingCount: userComments.length,
      criticRatingCount: criticComments.length,
    };

    return of(detail);
  }
}
