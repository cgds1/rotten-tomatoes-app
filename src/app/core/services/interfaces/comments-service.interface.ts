import { Observable } from 'rxjs';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../../models/comment.model';

export interface ICommentsService {
  getByMovie(movieId: string): Observable<Comment[]>;
  create(movieId: string, data: CreateCommentRequest): Observable<Comment>;
  update(commentId: string, data: UpdateCommentRequest): Observable<Comment>;
  delete(commentId: string): Observable<void>;
}
