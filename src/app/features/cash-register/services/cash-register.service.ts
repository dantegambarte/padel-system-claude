import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CashRegister, CashMovement, OpenCashDto, CloseCashDto, AddMovementDto } from '../models/cash-register.interface';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../../../core/models/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CashRegisterService {
  private readonly API_URL = `${environment.apiUrl}/cash-register`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la caja del día actual
   */
  getTodayCash(): Observable<CashRegister> {
    return this.http.get<ApiResponse<CashRegister>>(`${this.API_URL}/today`)
      .pipe(map(response => response.data!));
  }

  /**
   * Obtiene la caja por fecha
   */
  getCashByDate(fecha: string): Observable<CashRegister> {
    return this.http.get<ApiResponse<CashRegister>>(`${this.API_URL}/${fecha}`)
      .pipe(map(response => response.data!));
  }

  /**
   * Obtiene los movimientos de una caja
   */
  getMovements(cashRegisterId: string): Observable<CashMovement[]> {
    return this.http.get<ApiResponse<CashMovement[]>>(`${this.API_URL}/${cashRegisterId}/movements`)
      .pipe(map(response => response.data!));
  }

  /**
   * Abre la caja del día
   */
  openCash(data: OpenCashDto): Observable<CashRegister> {
    return this.http.post<ApiResponse<CashRegister>>(`${this.API_URL}/open`, data)
      .pipe(map(response => response.data!));
  }

  /**
   * Cierra la caja del día
   */
  closeCash(cashRegisterId: string, data: CloseCashDto): Observable<CashRegister> {
    return this.http.post<ApiResponse<CashRegister>>(`${this.API_URL}/${cashRegisterId}/close`, data)
      .pipe(map(response => response.data!));
  }

  /**
   * Agrega un movimiento a la caja
   */
  addMovement(cashRegisterId: string, movement: AddMovementDto): Observable<CashMovement> {
    return this.http.post<ApiResponse<CashMovement>>(`${this.API_URL}/${cashRegisterId}/movements`, movement)
      .pipe(map(response => response.data!));
  }

  /**
   * Obtiene el historial de cajas cerradas
   */
  getCashHistory(params?: PaginationParams): Observable<PaginatedResponse<CashRegister>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          const boolValue = params[key] === 'true' || params[key] === '1';
          httpParams = httpParams.set(key, boolValue ? 'true' : params[key].toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<CashRegister>>>(`${this.API_URL}/history`, { params: httpParams })
      .pipe(map(response => response.data!));
  }
}
