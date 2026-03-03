import { InjectionToken } from '@angular/core';
import { IAuthService } from './interfaces/auth-service.interface';
import { IMoviesService } from './interfaces/movies-service.interface';
import { ICommentsService } from './interfaces/comments-service.interface';

export const AUTH_SERVICE = new InjectionToken<IAuthService>('AuthService');
export const MOVIES_SERVICE = new InjectionToken<IMoviesService>('MoviesService');
export const COMMENTS_SERVICE = new InjectionToken<ICommentsService>('CommentsService');
