import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * Servicio para mostrar notificaciones toast usando Material Snackbar
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Muestra un mensaje de éxito
   */
  showSuccess(message: string, duration?: number): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration: duration || this.defaultConfig.duration,
      panelClass: ['snackbar-success'],
    });
  }

  /**
   * Muestra un mensaje de error
   */
  showError(message: string, duration?: number): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration: duration || 6000, // Errores se muestran más tiempo
      panelClass: ['snackbar-error'],
    });
  }

  /**
   * Muestra un mensaje de advertencia
   */
  showWarning(message: string, duration?: number): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration: duration || this.defaultConfig.duration,
      panelClass: ['snackbar-warning'],
    });
  }

  /**
   * Muestra un mensaje informativo
   */
  showInfo(message: string, duration?: number): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration: duration || this.defaultConfig.duration,
      panelClass: ['snackbar-info'],
    });
  }

  /**
   * Muestra un mensaje personalizado
   */
  show(
    message: string,
    action: string = 'Cerrar',
    config?: MatSnackBarConfig,
  ): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      ...config,
    });
  }

  /**
   * Cierra la notificación actual
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }
}
