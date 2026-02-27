import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CashRegisterService } from '../../services/cash-register.service';
import { CashRegister } from '../../models/cash-register.interface';
import { TableColumn } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-cash-register-history',
  templateUrl: './cash-register-history.component.html',
  styleUrls: ['./cash-register-history.component.scss']
})
export class CashRegisterHistoryComponent implements OnInit {
  cashRegisters: CashRegister[] = [];
  loading = false;

  columns: TableColumn[] = [
    { key: 'fecha', label: 'Fecha', sortable: true, type: 'date' },
    { key: 'monto_inicial', label: 'Monto Inicial', type: 'currency', sortable: true },
    { key: 'ingresos_turnos', label: 'Ing. Turnos', type: 'currency', sortable: true },
    { key: 'ingresos_buffet', label: 'Ing. Buffet', type: 'currency', sortable: true },
    { key: 'egresos', label: 'Egresos', type: 'currency', sortable: true },
    { key: 'monto_final', label: 'Monto Final', type: 'currency', sortable: true }
  ];

  constructor(
    private cashRegisterService: CashRegisterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.cashRegisterService.getCashHistory({ page: 1, limit: 50 }).subscribe({
      next: (response) => {
        this.cashRegisters = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cash-register']);
  }
}
