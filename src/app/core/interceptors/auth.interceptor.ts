import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, switchMap, catchError, throwError, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

const AUTH_URLS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Skip token injection and refresh logic for auth endpoints
  const isAuthRequest = AUTH_URLS.some((url) => req.url.includes(url));
  if (isAuthRequest) {
    return next(req);
  }

  return from(auth.getToken()).pipe(
    switchMap((token) => {
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Use a single refresh promise to prevent concurrent refresh calls
            if (!isRefreshing) {
              isRefreshing = true;
              refreshPromise = auth.refreshToken().finally(() => {
                isRefreshing = false;
                refreshPromise = null;
              });
            }

            return from(refreshPromise!).pipe(
              switchMap((newToken) => {
                if (newToken) {
                  const retryReq = req.clone({
                    setHeaders: { Authorization: `Bearer ${newToken}` },
                  });
                  return next(retryReq);
                }
                router.navigate(['/auth/login']);
                return throwError(() => error);
              }),
            );
          }
          return throwError(() => error);
        }),
      );
    }),
  );
};
