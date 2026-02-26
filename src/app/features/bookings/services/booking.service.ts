import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Booking, CreateBookingDto, UpdateBookingDto, Court } from '../models/booking.interface';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../../../core/models/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_URL = `${environment.apiUrl}/bookings`;
  private readonly COURTS_URL = `${environment.apiUrl}/courts`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los turnos con paginación y filtros
   */
  getBookings(params?: PaginationParams): Observable<PaginatedResponse<Booking>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<Booking>>>(this.API_URL, { params: httpParams })
      .pipe(map(response => response.data!));
  }

  /**
   * Obtiene turnos por fecha
   */
  getBookingsByDate(fecha: string): Observable<Booking[]> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.API_URL}/by-date/${fecha}`)
      .pipe(map(response => response.data!));
  }

  /**
   * Obtiene un turno por ID
   */
  getBookingById(id: string): Observable<Booking> {
    return this.http.get<ApiResponse<Booking>>(`${this.API_URL}/${id}`)
      .pipe(map(response => response.data!));
  }

  /**
   * Crea un nuevo turno
   */
  createBooking(booking: CreateBookingDto): Observable<Booking> {
    return this.http.post<ApiResponse<Booking>>(this.API_URL, booking)
      .pipe(map(response => response.data!));
  }

  /**
   * Actualiza un turno
   */
  updateBooking(id: string, booking: UpdateBookingDto): Observable<Booking> {
    return this.http.patch<ApiResponse<Booking>>(`${this.API_URL}/${id}`, booking)
      .pipe(map(response => response.data!));
  }

  /**
   * Cancela un turno
   */
  cancelBooking(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`)
      .pipe(map(response => response.data!));
  }

  /**
   * Verifica disponibilidad de horario
   */
  checkAvailability(courtId: string, fecha: string, horaInicio: string, horaFin: string, excludeId?: string): Observable<boolean> {
    let params = new HttpParams()
      .set('court_id', courtId)
      .set('fecha', fecha)
      .set('hora_inicio', horaInicio)
      .set('hora_fin', horaFin);

    if (excludeId) {
      params = params.set('exclude_id', excludeId);
    }

    return this.http.get<ApiResponse<{ available: boolean }>>(`${this.API_URL}/check-availability`, { params })
      .pipe(map(response => response.data!.available));
  }

  /**
   * Obtiene todas las canchas activas
   */
  getCourts(): Observable<Court[]> {
    return this.http.get<ApiResponse<Court[]>>(this.COURTS_URL)
      .pipe(map(response => response.data!));
  }

  /**
   * Registra pago de un turno
   */
  registerPayment(id: string, montoPagado: number): Observable<Booking> {
    return this.http.post<ApiResponse<Booking>>(`${this.API_URL}/${id}/payment`, { monto_pagado: montoPagado })
      .pipe(map(response => response.data!));
  }
}
