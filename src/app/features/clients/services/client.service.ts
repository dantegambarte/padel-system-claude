import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Client, CreateClientDto, UpdateClientDto, ClientWithBookings } from '../models/client.interface';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../../../core/models/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los clientes con paginación
   */
  getClients(params?: PaginationParams): Observable<PaginatedResponse<Client>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<Client>>>(this.API_URL, { params: httpParams })
      .pipe(map(response => response.data!));
  }

  /**
   * Busca clientes por nombre o teléfono
   */
  searchClients(query: string): Observable<Client[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<ApiResponse<Client[]>>(`${this.API_URL}/search`, { params })
      .pipe(map(response => response.data!));
  }

  /**
   * Obtiene un cliente por ID
   */
  getClientById(id: string): Observable<Client> {
    return this.http.get<ApiResponse<Client>>(`${this.API_URL}/${id}`)
      .pipe(map(response => response.data!));
  }

  /**
   * Obtiene un cliente con su historial de reservas
   */
  getClientWithBookings(id: string): Observable<ClientWithBookings> {
    return this.http.get<ApiResponse<ClientWithBookings>>(`${this.API_URL}/${id}/with-bookings`)
      .pipe(map(response => response.data!));
  }

  /**
   * Crea un nuevo cliente
   */
  createClient(client: CreateClientDto): Observable<Client> {
    return this.http.post<ApiResponse<Client>>(this.API_URL, client)
      .pipe(map(response => response.data!));
  }

  /**
   * Actualiza un cliente
   */
  updateClient(id: string, client: UpdateClientDto): Observable<Client> {
    return this.http.patch<ApiResponse<Client>>(`${this.API_URL}/${id}`, client)
      .pipe(map(response => response.data!));
  }

  /**
   * Elimina (desactiva) un cliente
   */
  deleteClient(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`)
      .pipe(map(response => response.data!));
  }

  /**
   * Verifica si un teléfono ya existe
   */
  checkPhoneExists(telefono: string, excludeId?: string): Observable<boolean> {
    let params = new HttpParams().set('telefono', telefono);
    if (excludeId) {
      params = params.set('exclude_id', excludeId);
    }

    return this.http.get<ApiResponse<{ exists: boolean }>>(`${this.API_URL}/check-phone`, { params })
      .pipe(map(response => response.data!.exists));
  }

  /**
   * Verifica si un DNI ya existe
   */
  checkDniExists(dni: string, excludeId?: string): Observable<boolean> {
    let params = new HttpParams().set('dni', dni);
    if (excludeId) {
      params = params.set('exclude_id', excludeId);
    }

    return this.http.get<ApiResponse<{ exists: boolean }>>(`${this.API_URL}/check-dni`, { params })
      .pipe(map(response => response.data!.exists));
  }
}
