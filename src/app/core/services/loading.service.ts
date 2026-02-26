import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servicio para controlar el estado de carga global de la aplicación
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private requestsInProgress = 0;

  constructor() {}

  /**
   * Muestra el spinner de carga
   */
  show(): void {
    this.requestsInProgress++;
    if (this.requestsInProgress === 1) {
      this.loadingSubject.next(true);
    }
  }

  /**
   * Oculta el spinner de carga
   */
  hide(): void {
    this.requestsInProgress--;
    if (this.requestsInProgress <= 0) {
      this.requestsInProgress = 0;
      this.loadingSubject.next(false);
    }
  }

  /**
   * Fuerza ocultar el spinner (usar con precaución)
   */
  forceHide(): void {
    this.requestsInProgress = 0;
    this.loadingSubject.next(false);
  }

  /**
   * Obtiene el estado actual de carga
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}
