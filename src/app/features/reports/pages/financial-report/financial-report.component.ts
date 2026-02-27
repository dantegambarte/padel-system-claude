import { Component, OnInit } from '@angular/core';
import { ReportService, FinancialReportData } from '../../services/report.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.scss']
})
export class FinancialReportComponent implements OnInit {
  fechaDesde: Date;
  fechaHasta: Date;
  reportData?: FinancialReportData;
  loading = false;

  constructor(
    private reportService: ReportService,
    private notificationService: NotificationService
  ) {
    // Por defecto: primer día del mes actual hasta hoy
    const today = new Date();
    this.fechaDesde = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fechaHasta = today;
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    if (!this.fechaDesde || !this.fechaHasta) {
      this.notificationService.showWarning('Selecciona un rango de fechas');
      return;
    }

    if (this.fechaDesde > this.fechaHasta) {
      this.notificationService.showWarning('La fecha inicial no puede ser mayor a la final');
      return;
    }

    this.loading = true;
    const desde = this.formatDate(this.fechaDesde);
    const hasta = this.formatDate(this.fechaHasta);

    this.reportService.getFinancialReport(desde, hasta).subscribe({
      next: (data) => {
        this.reportData = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.showError('Error al cargar reporte');
      }
    });
  }

  exportPDF(): void {
    if (!this.reportData) return;
    this.reportService.exportToPDF('financial', this.reportData);
    this.notificationService.showInfo('Funcionalidad de exportación en desarrollo');
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  get balanceColor(): string {
    if (!this.reportData) return '';
    return this.reportData.balance >= 0 ? 'positive' : 'negative';
  }
}
