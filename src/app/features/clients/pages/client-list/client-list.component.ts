import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.interface';
import { TableColumn, TableAction } from '../../../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ClientFormComponent } from '../../components/client-form/client-form.component';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  loading = false;
  searchQuery = '';

  columns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'apellido', label: 'Apellido', sortable: true },
    { key: 'telefono', label: 'Teléfono', sortable: false },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'dni', label: 'DNI', sortable: false }
  ];

  actions: TableAction[] = [
    {
      icon: 'visibility',
      label: 'Ver historial',
      action: (row) => this.viewDetails(row)
    },
    {
      icon: 'edit',
      label: 'Editar',
      color: 'primary',
      action: (row) => this.edit(row)
    },
    {
      icon: 'delete',
      label: 'Eliminar',
      color: 'warn',
      action: (row) => this.delete(row),
      show: (row) => row.activo
    }
  ];

  constructor(
    private clientService: ClientService,
    private router: Router,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getClients({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.clients = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim().length < 3) {
      this.loadClients();
      return;
    }

    this.loading = true;
    this.clientService.searchClients(this.searchQuery).subscribe({
      next: (clients) => {
        this.clients = clients;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadClients();
  }

  viewDetails(client: Client): void {
    this.router.navigate(['/clients', client.id]);
  }

  edit(client: Client): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '600px',
      data: { client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
      }
    });
  }

  delete(client: Client): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '¿Eliminar cliente?',
        message: `¿Estás seguro de eliminar a ${client.nombre} ${client.apellido}? Esta acción no se puede deshacer.`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.deleteClient(client.id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Cliente eliminado correctamente');
            this.loadClients();
          }
        });
      }
    });
  }

  create(): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
      }
    });
  }
}
