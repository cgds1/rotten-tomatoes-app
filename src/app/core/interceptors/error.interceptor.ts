import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastController } from '@ionic/angular';

const ERROR_MESSAGES: Record<number, string> = {
  0: 'Sin conexión a internet',
  400: 'Datos inválidos',
  403: 'No tenés permiso para esta acción',
  404: 'No se encontró el recurso',
  409: 'Conflicto con datos existentes',
  429: 'Demasiadas solicitudes, esperá un momento',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastCtrl = inject(ToastController);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return throwError(() => error);
      }

      let message: string;
      if (error.status >= 500) {
        message = 'Error del servidor';
      } else {
        const backendMsg = error.error?.message;
        if (Array.isArray(backendMsg)) {
          message = backendMsg.join('. ');
        } else {
          message = backendMsg || ERROR_MESSAGES[error.status] || 'Error inesperado';
        }
      }

      toastCtrl
        .create({
          message,
          duration: 3000,
          position: 'bottom',
          color: 'danger',
        })
        .then((toast) => toast.present());

      return throwError(() => error);
    }),
  );
};
