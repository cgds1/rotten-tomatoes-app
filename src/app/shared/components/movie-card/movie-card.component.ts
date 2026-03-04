import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MovieCardComponent implements OnChanges {
  @Input({ required: true }) movie!: Movie;

  posterLoaded = false;
  hasError = false;
  displayUrl = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movie']) {
      const prev = changes['movie'].previousValue as Movie | undefined;
      const curr = changes['movie'].currentValue as Movie;

      // Only reset state if the poster URL has actually changed
      if (!prev || prev.posterUrl !== curr.posterUrl) {
        this.posterLoaded = false;
        this.hasError = false;
        this.displayUrl = curr.posterUrl;
      }
      this.cdr.markForCheck();
    }
  }

  get year(): string {
    return this.movie.releaseDate?.substring(0, 4) ?? '';
  }

  onPosterLoad(): void {
    this.posterLoaded = true;
    this.cdr.markForCheck();
  }

  onPosterError(): void {
    this.hasError = true;
    this.posterLoaded = true;
    this.displayUrl = 'https://images.placeholders.dev/?width=500&height=750&text=No%20Image&theme=dark';
    this.cdr.markForCheck();
  }
}
