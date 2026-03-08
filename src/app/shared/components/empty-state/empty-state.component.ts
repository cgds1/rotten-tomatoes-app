import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class EmptyStateComponent {
  @Input() icon = 'film-outline';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}
