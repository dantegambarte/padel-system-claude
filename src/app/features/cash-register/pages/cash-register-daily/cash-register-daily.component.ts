import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CashRegisterService } from '../../services/cash-register.service';
import { CashRegister, CashMovement } from '../../models/cash-register.interface';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cash-register-daily',
  templateUrl: './cash-register-daily.component.html',
  styleUrls: ['./cash-register-daily.component.scss']
})
export class CashRegisterDailyComponent implements OnInit {
  cashRegister?: CashRegister;
  movements: CashMovement[] = [];
  loading = false;

  constructor(
    private cashRegisterService: CashRegisterService,
    private router: Router,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTodayCash();
  }

  loadTodayCash(): void {
    this.loading = true;
    this.cashRegisterService.getTodayCash().subscribe({
      next: (cash) => {
        this.cashRegister = cash;
        this.movements = cash.movements || [];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 404) {
          // No hay caja abierta
          this.promptOpenCash();
        } else {
          this.notificationService.showError('Error al cargar la caja');
        }
      }
    });
  }

  promptOpenCash(): void {
    const monto = prompt('Ingresa el monto inicial de caja:');
    if (!monto) return;

    const montoInicial = parseFloat(monto);
    if (isNaN(montoInicial) || montoInicial < 0) {
      this.notificationService.showError('Monto inválido');
      return;
    }

    this.cashRegisterService.openCash({ monto_inicial: montoInicial }).subscribe({
      next: (cash) => {
        this.notificationService.showSuccess('Caja abierta correctamente');
        this.cashRegister = cash;
        this.movements = [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  addIngreso(): void {
    if (!this.cashRegister) return;

    const concepto = prompt('Concepto del ingreso:');
    if (!concepto) return;

    const montoStr = prompt('Monto:');
    if (!montoStr) return;

    const monto = parseFloat(montoStr);
    if (isNaN(monto) || monto <= 0) {
      this.notificationService.showError('Monto inválido');
      return;
    }

    this.cashRegisterService.addMovement(this.cashRegister.id, {
      tipo: 'ingreso',
      concepto,
      monto
    }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Ingreso registrado');
        this.loadTodayCash();
      }
    });
  }

  addEgreso(): void {
    if (!this.cashRegister) return;

    const concepto = prompt('Concepto del egreso:');
    if (!concepto) return;

    const montoStr = prompt('Monto:');
    if (!montoStr) return;

    const monto = parseFloat(montoStr);
    if (isNaN(monto) || monto <= 0) {
      this.notificationService.showError('Monto inválido');
      return;
    }

    this.cashRegisterService.addMovement(this.cashRegister.id, {
      tipo: 'egreso',
      concepto,
      monto
    }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Egreso registrado');
        this.loadTodayCash();
      }
    });
  }

  closeCash(): void {
    if (!this.cashRegister || this.cashRegister.cerrada) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '¿Cerrar caja?',
        message: 'Esta acción no se puede deshacer. Asegúrate de haber registrado todos los movimientos.',
        confirmText: 'Sí, cerrar caja',
        confirmColor: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const montoContado = prompt(`Monto final contado (calculado: ${this.cashRegister!.monto_final}):`);
        if (!montoContado) return;

        const monto = parseFloat(montoContado);
        if (isNaN(monto)) {
          this.notificationService.showError('Monto inválido');
          return;
        }

        this.cashRegisterService.closeCash(this.cashRegister!.id, {
          monto_final_contado: monto
        }).subscribe({
          next: () => {
            this.notificationService.showSuccess('Caja cerrada correctamente');
            this.loadTodayCash();
          }
        });
      }
    });
  }

  viewHistory(): void {
    this.router.navigate(['/cash-register/history']);
  }
}
