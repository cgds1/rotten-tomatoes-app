import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { MoviesState } from '../../../state/movies.state';
import { Movie, SortBy } from '../../../core/models/movie.model';
import { from, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-movie-list',
  templateUrl: 'movie-list.page.html',
  styleUrls: ['movie-list.page.scss'],
  standalone: false,
})
export class MovieListPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  private destroyRef = inject(DestroyRef);
  private searchSubject = new Subject<string>();
  private sortSubject = new Subject<SortBy>();
  private categorySubject = new Subject<number | null>();

  constructor(
    public state: MoviesState,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.state.loadMovies();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(query => this.state.setSearch(query));

    this.sortSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(field => from(this.state.setSortBy(field))),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.content?.scrollToTop(300));

    this.categorySubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(id => from(this.state.setCategory(id))),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.content?.scrollToTop(300));
  }

  onSearchChange(event: CustomEvent): void {
    this.searchSubject.next(event.detail.value || '');
  }

  selectCategory(id: number | null): void {
    this.categorySubject.next(id);
  }

  onSortChange(event: CustomEvent): void {
    this.sortSubject.next(event.detail.value as SortBy);
  }

  async onInfiniteScroll(event: any): Promise<void> {
    await this.state.loadMore();
    event.target.complete();
  }

  async onRefresh(event: any): Promise<void> {
    await this.state.loadMovies();
    event.target.complete();
  }

  openMovie(movie: Movie): void {
    this.router.navigate(['/movies', movie.id]);
  }

  trackByMovieId(_index: number, movie: Movie): string {
    return movie.id;
  }
}
