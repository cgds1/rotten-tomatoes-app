import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-rating-badge',
  templateUrl: './rating-badge.component.html',
  styleUrls: ['./rating-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class RatingBadgeComponent implements OnChanges {
  @Input() type: 'user' | 'critic' = 'user';
  @Input() value: number | null = null;

  displayValue = '—';
  private animationFrame: number | null = null;

  @ViewChild('valueEl', { static: false }) valueEl!: ElementRef<HTMLSpanElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.animateValue(changes['value'].previousValue, this.value);
    }
  }

  private animateValue(from: number | null, to: number | null): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    if (to === null || to === undefined) {
      this.displayValue = '—';
      return;
    }

    const startVal = typeof from === 'number' ? from : 0;
    const endVal = to;
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * eased;
      this.displayValue = current.toFixed(1);

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
