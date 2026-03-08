import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ErrorStateComponent {
  @Input() message = 'Ocurrió un error inesperado';
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
