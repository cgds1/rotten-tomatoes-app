import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true,
    },
  ],
})
export class StarRatingComponent implements ControlValueAccessor {
  stars = Array.from({ length: 10 }, (_, i) => i + 1);
  value: number = 0;
  selectedStar: number | null = null;
  disabled = false;

  private onChange: (val: number) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  writeValue(val: number): void {
    this.value = val || 0;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (val: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  selectStar(star: number): void {
    if (this.disabled) return;
    this.value = star;
    this.selectedStar = star;
    this.onChange(star);
    this.onTouched();

    setTimeout(() => {
      this.selectedStar = null;
      this.cdr.markForCheck();
    }, 300);
  }
}
