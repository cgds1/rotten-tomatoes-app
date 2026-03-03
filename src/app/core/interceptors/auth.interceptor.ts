import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return from(auth.getToken()).pipe(
    switchMap((token) => {
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return from(auth.refreshToken()).pipe(
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
