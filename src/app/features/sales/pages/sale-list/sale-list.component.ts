import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../models/sale.interface';
import { TableColumn, TableAction } from '../../../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent implements OnInit {
  sales: Sale[] = [];
  loading = false;
  selectedDate: Date = new Date();
  dailySummary: any = null;

  columns: TableColumn[] = [
    { key: 'hora', label: 'Hora', sortable: true, width: '100px' },
    { key: 'vendedor', label: 'Vendedor', sortable: false },
    { key: 'metodo_pago', label: 'Método Pago', sortable: true },
    { key: 'monto_total', label: 'Total', type: 'currency', sortable: true }
  ];

  actions: TableAction[] = [
    {
      icon: 'visibility',
      label: 'Ver detalle',
      action: (row) => this.viewDetails(row)
    }
  ];

  constructor(
    private saleService: SaleService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadSales();
    this.loadSummary();
  }

  loadSales(): void {
    this.loading = true;
    const fecha = this.selectedDate.toISOString().split('T')[0];
    this.saleService.getSalesByDate(fecha).subscribe({
      next: (sales) => {
        this.sales = sales;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadSummary(): void {
    const fecha = this.selectedDate.toISOString().split('T')[0];
    this.saleService.getDailySummary(fecha).subscribe({
      next: (summary) => this.dailySummary = summary,
      error: () => {}
    });
  }

  onDateChange(): void {
    this.loadSales();
    this.loadSummary();
  }

  viewDetails(sale: Sale): void {
    this.router.navigate(['/sales', sale.id]);
  }
}
