import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Interceptor que maneja errores HTTP de forma centralizada
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error inesperado';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          switch (error.status) {
            case 0:
              errorMessage =
                'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
              break;
            case 400:
              errorMessage = error.error?.message || 'Solicitud inválida';
              break;
            case 401:
              errorMessage =
                'Sesión expirada. Por favor, inicia sesión nuevamente.';
              this.authService.logout();
              break;
            case 403:
              errorMessage = 'No tienes permisos para realizar esta acción';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 409:
              errorMessage =
                error.error?.message || 'Conflicto en la operación';
              break;
            case 422:
              errorMessage =
                error.error?.message || 'Datos de validación incorrectos';
              break;
            case 500:
              errorMessage =
                'Error interno del servidor. Intenta nuevamente más tarde.';
              break;
            case 503:
              errorMessage = 'Servicio no disponible temporalmente';
              break;
            default:
              errorMessage =
                error.error?.message ||
                `Error ${error.status}: ${error.statusText}`;
          }
        }

        if (error.status !== 401) {
          this.notificationService.showError(errorMessage);
        }

        // Propagar el error para que los componentes puedan manejarlo si es necesario
        return throwError(() => ({
          status: error.status,
          message: errorMessage,
          originalError: error,
        }));
      }),
    );
  }
}
