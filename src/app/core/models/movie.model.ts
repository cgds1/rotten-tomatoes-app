export interface Category {
  id: number;
  name: string;
}

export interface CastMember {
  name: string;
  character: string;
  profileUrl: string | null;
  imageError?: boolean;
}

export interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  synopsis: string;
  releaseDate: string;
  posterUrl: string;
  backdropUrl: string;
  runtime: number;
  userRating: number;
  criticRating: number;
  categories: Category[];
}

export interface MovieDetail extends Movie {
  cast: CastMember[];
  comments: import('./comment.model').Comment[];
  userRatingCount: number;
  criticRatingCount: number;
}

export type SortBy = 'userRating' | 'criticRating' | 'releaseDate';
export type SortOrder = 'asc' | 'desc';

export interface MovieFilter {
  search?: string;
  categories?: number[];
  releaseDateFrom?: string;
  releaseDateTo?: string;
  minUserRating?: number;
  minCriticRating?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
