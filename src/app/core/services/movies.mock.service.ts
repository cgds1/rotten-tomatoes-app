import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IMoviesService } from './interfaces/movies-service.interface';
import { Movie, MovieDetail, MovieFilter, PaginatedResponse } from '../models/movie.model';
import { MOCK_MOVIES, MockMovieData } from '../mocks/mock-movies';
import { MOCK_COMMENTS } from '../mocks/mock-comments';

@Injectable({ providedIn: 'root' })
export class MoviesMockService implements IMoviesService {
  private movies: MockMovieData[] = [...MOCK_MOVIES];

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

    return of({ data, total, page, limit });
  }

  searchMovies(query: string): Observable<Movie[]> {
    const q = query.toLowerCase();
    const results = this.movies
      .filter(m => m.title.toLowerCase().includes(q))
      .map(({ cast, ...movie }) => movie);
    return of(results);
  }

  getMovieDetail(id: string): Observable<MovieDetail> {
    const movie = this.movies.find(m => m.id === id);
    if (!movie) {
      throw new Error(`Película no encontrada: ${id}`);
    }

    const comments = MOCK_COMMENTS.filter(c => c.movieId === id);
    const userComments = comments.filter(c => c.user.role === 'USER');
    const criticComments = comments.filter(c => c.user.role === 'CRITIC');

    const detail: MovieDetail = {
      ...movie,
      comments,
      userRatingCount: userComments.length,
      criticRatingCount: criticComments.length,
    };

    return of(detail);
  }
}
