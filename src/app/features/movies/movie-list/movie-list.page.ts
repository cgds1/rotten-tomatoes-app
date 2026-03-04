import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { MoviesState } from '../../../state/movies.state';
import { Movie, SortBy } from '../../../core/models/movie.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-movie-list',
  templateUrl: 'movie-list.page.html',
  styleUrls: ['movie-list.page.scss'],
  standalone: false,
})
export class MovieListPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  private searchSubject = new Subject<string>();

  constructor(
    public state: MoviesState,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.state.loadMovies();

    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(query => this.state.setSearch(query));
  }

  onSearchChange(event: CustomEvent): void {
    this.searchSubject.next(event.detail.value || '');
  }

  async selectCategory(id: number | null): Promise<void> {
    await this.state.setCategory(id);
    this.content?.scrollToTop(300);
  }

  async onSortChange(event: CustomEvent): Promise<void> {
    await this.state.setSortBy(event.detail.value as SortBy);
    this.content?.scrollToTop(300);
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
