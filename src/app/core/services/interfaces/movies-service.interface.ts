import { Observable } from 'rxjs';
import { Movie, MovieDetail, MovieFilter, PaginatedResponse } from '../../models/movie.model';

export interface IMoviesService {
  getMovies(filters: MovieFilter): Observable<PaginatedResponse<Movie>>;
  searchMovies(query: string): Observable<Movie[]>;
  getMovieDetail(id: string): Observable<MovieDetail>;
}
