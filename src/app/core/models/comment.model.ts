import { User } from './user.model';

export interface Comment {
  id: string;
  content: string;
  score: number;
  user: Pick<User, 'id' | 'name' | 'role'>;
  movieId: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  score: number;
  content: string;
}

export interface UpdateCommentRequest {
  score?: number;
  content?: string;
}
