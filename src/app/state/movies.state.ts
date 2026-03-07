import { Injectable, Inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Movie, MovieFilter, Category, SortBy } from '../core/models/movie.model';
import { IMoviesService } from '../core/services/interfaces/movies-service.interface';
import { MOVIES_SERVICE } from '../core/services/service-tokens';
import { MOCK_CATEGORIES } from '../core/mocks/mock-categories';

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
  private _categories = signal<Category[]>(MOCK_CATEGORIES);
  private _selectedCategory = signal<number | null>(null);
  private _total = signal(0);

  // Computed
  readonly movies = this._movies.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();
  readonly total = this._total.asReadonly();
  readonly filteredMovies = computed(() => this._movies());
  readonly hasMovies = computed(() => this._movies().length > 0);
  readonly hasMore = computed(() => this._movies().length < this._total());

  constructor(
    @Inject(MOVIES_SERVICE) private moviesService: IMoviesService
  ) {}

  async loadMovies(): Promise<void> {
    this._loading.set(true);
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

  setSearch(query: string): Promise<void> {
    this._filters.update(f => ({ ...f, search: query || undefined }));
    return this.loadMovies();
  }
}
