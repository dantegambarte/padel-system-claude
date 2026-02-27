import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Sale, CreateSaleDto } from '../models/sale.interface';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../../../core/models/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private readonly API_URL = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  getSales(params?: PaginationParams): Observable<PaginatedResponse<Sale>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResponse<Sale>>>(this.API_URL, { params: httpParams })
      .pipe(map(response => response.data!));
  }

  getSalesByDate(fecha: string): Observable<Sale[]> {
    return this.http.get<ApiResponse<Sale[]>>(`${this.API_URL}/by-date/${fecha}`)
      .pipe(map(response => response.data!));
  }

  getSaleById(id: string): Observable<Sale> {
    return this.http.get<ApiResponse<Sale>>(`${this.API_URL}/${id}`)
      .pipe(map(response => response.data!));
  }

  createSale(sale: CreateSaleDto): Observable<Sale> {
    return this.http.post<ApiResponse<Sale>>(this.API_URL, sale)
      .pipe(map(response => response.data!));
  }

  getDailySummary(fecha: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/summary/${fecha}`)
      .pipe(map(response => response.data!));
  }
}
