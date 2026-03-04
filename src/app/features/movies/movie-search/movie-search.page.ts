import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Movie } from '../../../core/models/movie.model';
import { IMoviesService } from '../../../core/services/interfaces/movies-service.interface';
import { MOVIES_SERVICE } from '../../../core/services/service-tokens';
import { StorageService } from '../../../core/services/storage.service';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT = 5;

@Component({
  selector: 'app-movie-search',
  templateUrl: 'movie-search.page.html',
  styleUrls: ['movie-search.page.scss'],
  standalone: false,
})
export class MovieSearchPage implements OnInit {
  results: Movie[] = [];
  recentSearches: string[] = [];
  query = '';
  searched = false;
  loading = false;

  private searchSubject = new Subject<string>();

  constructor(
    @Inject(MOVIES_SERVICE) private moviesService: IMoviesService,
    private storage: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecentSearches();

    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(query => {
          if (!query.trim()) {
            this.searched = false;
            this.loading = false;
            return of([]);
          }
          this.loading = true;
          this.searched = true;
          return this.moviesService.searchMovies(query);
        })
      )
      .subscribe(results => {
        this.results = results;
        this.loading = false;
      });
  }

  onSearchChange(event: CustomEvent): void {
    this.query = event.detail.value || '';
    this.searchSubject.next(this.query);
  }

  async searchFromRecent(term: string): Promise<void> {
    this.query = term;
    this.searchSubject.next(term);
    await this.saveRecentSearch(term);
  }

  async onSearch(): Promise<void> {
    if (this.query.trim()) {
      await this.saveRecentSearch(this.query.trim());
    }
  }

  openMovie(movie: Movie): void {
    if (this.query.trim()) {
      this.saveRecentSearch(this.query.trim());
    }
    this.router.navigate(['/movies', movie.id]);
  }

  getYear(movie: Movie): string {
    return movie.releaseDate?.substring(0, 4) ?? '';
  }

  private async loadRecentSearches(): Promise<void> {
    const stored = await this.storage.get<string[]>(RECENT_SEARCHES_KEY);
    this.recentSearches = stored || [];
  }

  private async saveRecentSearch(term: string): Promise<void> {
    this.recentSearches = [
      term,
      ...this.recentSearches.filter(s => s !== term),
    ].slice(0, MAX_RECENT);
    await this.storage.set(RECENT_SEARCHES_KEY, this.recentSearches);
  }

  async removeRecent(term: string, event: Event): Promise<void> {
    event.stopPropagation();
    this.recentSearches = this.recentSearches.filter(s => s !== term);
    await this.storage.set(RECENT_SEARCHES_KEY, this.recentSearches);
  }
}
