import { Injectable, Inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Movie, MovieFilter, Category, SortBy } from '../core/models/movie.model';
import { IMoviesService } from '../core/services/interfaces/movies-service.interface';
import { MOVIES_SERVICE } from '../core/services/service-tokens';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MoviesState {
  // Signals
  private _movies = signal<Movie[]>([]);
  private _loading = signal(false);
  private _filters = signal<MovieFilter>({
    sortBy: 'userRating',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });
  private _categories = signal<Category[]>([]);
  private _selectedCategory = signal<number | null>(null);
  private _total = signal(0);
  private _error = signal<string | null>(null);

  // Computed
  readonly movies = this._movies.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();
  readonly total = this._total.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filteredMovies = computed(() => this._movies());
  readonly hasMovies = computed(() => this._movies().length > 0);
  readonly hasMore = computed(() => this._movies().length < this._total());

  constructor(
    @Inject(MOVIES_SERVICE) private moviesService: IMoviesService,
    private http: HttpClient,
  ) {
    this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    try {
      const categories = await firstValueFrom(
        this.http.get<Category[]>(`${environment.apiUrl}/categories`),
      );
      this._categories.set(categories);
    } catch {
      // Categories will remain empty if API fails
    }
  }

  async loadMovies(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const filters: MovieFilter = {
        ...this._filters(),
        page: 1,
      };

      if (this._selectedCategory() !== null) {
        filters.categories = [this._selectedCategory()!];
      }

      const response = await firstValueFrom(this.moviesService.getMovies(filters));
      this._movies.set(response.data);
      this._total.set(response.total);
      this._filters.update(f => ({ ...f, page: 1 }));
    } catch {
      this._error.set('Error al cargar películas');
    } finally {
      this._loading.set(false);
    }
  }

  updateFilters(partial: Partial<MovieFilter>): Promise<void> {
    this._filters.update(f => ({ ...f, ...partial }));
    return this.loadMovies();
  }

  async loadMore(): Promise<void> {
    if (!this.hasMore() || this._loading()) return;

    const currentFilters = this._filters();
    const nextPage = (currentFilters.page || 1) + 1;

    const filters: MovieFilter = {
      ...currentFilters,
      page: nextPage,
    };

    if (this._selectedCategory() !== null) {
      filters.categories = [this._selectedCategory()!];
    }

    const response = await firstValueFrom(this.moviesService.getMovies(filters));
    this._movies.update(movies => [...movies, ...response.data]);
    this._total.set(response.total);
    this._filters.update(f => ({ ...f, page: nextPage }));
  }

  setCategory(id: number | null): Promise<void> {
    this._selectedCategory.set(id);
    return this.loadMovies();
  }

  setSortBy(field: SortBy): Promise<void> {
    this._filters.update(f => ({ ...f, sortBy: field, sortOrder: 'desc' }));
    return this.loadMovies();
  }

  async setSearch(query: string): Promise<void> {
    this._filters.update(f => ({ ...f, search: query || undefined }));

    // If searching, first trigger TMDB search to persist new movies in the backend DB,
    // then load the filtered local list
    if (query.trim()) {
      try {
        await firstValueFrom(this.moviesService.searchMovies(query));
      } catch {
        // TMDB search failed — still try to load local results
      }
    }

    return this.loadMovies();
  }
}
