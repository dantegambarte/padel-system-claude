import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.interface';

export interface FinancialReportData {
  fecha_desde: string;
  fecha_hasta: string;
  total_ingresos: number;
  total_egresos: number;
  balance: number;
  ingresos_por_dia?: any[];
  egresos_por_dia?: any[];
}

export interface OccupancyReportData {
  fecha_desde: string;
  fecha_hasta: string;
  total_turnos: number;
  horas_ocupadas: number;
  tasa_ocupacion: number;
  ocupacion_por_cancha?: any[];
  ocupacion_por_dia?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly API_URL = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene reporte financiero por rango de fechas
   */
  getFinancialReport(fechaDesde: string, fechaHasta: string): Observable<FinancialReportData> {
    const params = new HttpParams()
      .set('fecha_desde', fechaDesde)
      .set('fecha_hasta', fechaHasta);

    return this.http.get<ApiResponse<FinancialReportData>>(`${this.API_URL}/financial`, { params })
      .pipe(map(response => response.data!));
  }

  /**
   * Obtiene reporte de ocupación por rango de fechas
   */
  getOccupancyReport(fechaDesde: string, fechaHasta: string): Observable<OccupancyReportData> {
    const params = new HttpParams()
      .set('fecha_desde', fechaDesde)
      .set('fecha_hasta', fechaHasta);

    return this.http.get<ApiResponse<OccupancyReportData>>(`${this.API_URL}/occupancy`, { params })
      .pipe(map(response => response.data!));
  }

  /**
   * Exportar reporte a PDF (futuro)
   */
  exportToPDF(reportType: string, data: any): void {
    console.log('Exportando a PDF:', reportType, data);
    // TODO: Implementar con jsPDF o similar
  }
}
