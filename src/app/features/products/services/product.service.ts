import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Product, CreateProductDto, UpdateProductDto, StockAdjustment } from '../models/product.interface';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../../../core/models/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(params?: PaginationParams): Observable<PaginatedResponse<Product>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResponse<Product>>>(this.API_URL, { params: httpParams })
      .pipe(map(response => response.data!));
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.API_URL}/${id}`)
      .pipe(map(response => response.data!));
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(this.API_URL, product)
      .pipe(map(response => response.data!));
  }

  updateProduct(id: string, product: UpdateProductDto): Observable<Product> {
    return this.http.patch<ApiResponse<Product>>(`${this.API_URL}/${id}`, product)
      .pipe(map(response => response.data!));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`)
      .pipe(map(response => response.data!));
  }

  adjustStock(adjustment: StockAdjustment): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(`${this.API_URL}/adjust-stock`, adjustment)
      .pipe(map(response => response.data!));
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.API_URL}/low-stock`)
      .pipe(map(response => response.data!));
  }
}
