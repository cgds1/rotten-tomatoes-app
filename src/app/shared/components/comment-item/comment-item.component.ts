import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Comment } from '../../../core/models/comment.model';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CommentItemComponent {
  @Input() comment!: Comment;
  @Input() currentUserId: string = '';

  @Output() onEdit = new EventEmitter<Comment>();
  @Output() onDelete = new EventEmitter<Comment>();

  get isOwn(): boolean {
    return this.comment.user.id === this.currentUserId;
  }

  get initials(): string {
    return this.comment.user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  get avatarColor(): string {
    let hash = 0;
    for (const char of this.comment.user.name) {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 40%, 35%)`;
  }

  get relativeDate(): string {
    const now = new Date();
    const date = new Date(this.comment.createdAt);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays < 30) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
