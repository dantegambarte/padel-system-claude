import { Component, OnInit } from '@angular/core';
import { CourtService } from '../../services/court.service';
import { Court, CourtType } from '../../models/court.interface';
import { TableColumn, TableAction } from '../../../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-court-list',
  templateUrl: './court-list.component.html',
  styleUrls: ['./court-list.component.scss']
})
export class CourtListComponent implements OnInit {
  courts: Court[] = [];
  loading = false;

  columns: TableColumn[] = [
    { key: 'orden', label: 'Orden', sortable: true, width: '80px' },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'tipo', label: 'Tipo', sortable: true },
    { key: 'precio_base', label: 'Precio Base', type: 'currency', sortable: true },
    { key: 'activa', label: 'Estado', sortable: true }
  ];

  actions: TableAction[] = [
    {
      icon: 'edit',
      label: 'Editar',
      color: 'primary',
      action: (row) => this.edit(row)
    },
    {
      icon: row => row.activa ? 'visibility_off' : 'visibility',
      label: row => row.activa ? 'Desactivar' : 'Activar',
      color: 'accent',
      action: (row) => this.toggleActive(row)
    },
    {
      icon: 'delete',
      label: 'Eliminar',
      color: 'warn',
      action: (row) => this.delete(row)
    }
  ];

  constructor(
    private courtService: CourtService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCourts();
  }

  loadCourts(): void {
    this.loading = true;
    this.courtService.getCourts().subscribe({
      next: (courts) => {
        this.courts = courts.sort((a, b) => a.orden - b.orden);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  create(): void {
    const nombre = prompt('Nombre de la cancha:');
    if (!nombre) return;

    const tipo = confirm('¿Es cancha techada? (Cancelar = Descubierta)') 
      ? CourtType.TECHADA 
      : CourtType.DESCUBIERTA;

    const precioStr = prompt('Precio base:');
    if (!precioStr) return;

    const precio_base = parseFloat(precioStr);
    if (isNaN(precio_base)) {
      this.notificationService.showError('Precio inválido');
      return;
    }

    this.courtService.createCourt({ nombre, tipo, precio_base }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Cancha creada');
        this.loadCourts();
      }
    });
  }

  edit(court: Court): void {
    const nombre = prompt('Nuevo nombre:', court.nombre);
    if (!nombre) return;

    const precioStr = prompt('Nuevo precio:', court.precio_base.toString());
    if (!precioStr) return;

    const precio_base = parseFloat(precioStr);
    if (isNaN(precio_base)) {
      this.notificationService.showError('Precio inválido');
      return;
    }

    this.courtService.updateCourt(court.id, { nombre, precio_base }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Cancha actualizada');
        this.loadCourts();
      }
    });
  }

  toggleActive(court: Court): void {
    this.courtService.updateCourt(court.id, { activa: !court.activa }).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          court.activa ? 'Cancha desactivada' : 'Cancha activada'
        );
        this.loadCourts();
      }
    });
  }

  delete(court: Court): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '¿Eliminar cancha?',
        message: `¿Estás seguro de eliminar ${court.nombre}? Esta acción no se puede deshacer.`,
        confirmText: 'Sí, eliminar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courtService.deleteCourt(court.id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Cancha eliminada');
            this.loadCourts();
          }
        });
      }
    });
  }
}
