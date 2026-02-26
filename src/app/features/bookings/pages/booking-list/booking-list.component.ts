import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking, BookingStatus } from '../../models/booking.interface';
import { TableColumn, TableAction } from '../../../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;
  selectedDate: Date = new Date();

  columns: TableColumn[] = [
    { key: 'hora_inicio', label: 'Hora', sortable: true, width: '100px' },
    { key: 'court', label: 'Cancha', sortable: false },
    { key: 'client', label: 'Cliente', sortable: false },
    { key: 'estado', label: 'Estado', type: 'badge', sortable: true },
    { key: 'monto_total', label: 'Monto', type: 'currency', sortable: true }
  ];

  actions: TableAction[] = [
    {
      icon: 'visibility',
      label: 'Ver detalles',
      action: (row) => this.viewDetails(row)
    },
    {
      icon: 'edit',
      label: 'Editar',
      color: 'primary',
      action: (row) => this.edit(row),
      show: (row) => row.estado !== BookingStatus.CANCELADO
    },
    {
      icon: 'attach_money',
      label: 'Cobrar',
      color: 'accent',
      action: (row) => this.registerPayment(row),
      show: (row) => row.estado !== BookingStatus.PAGADO && row.estado !== BookingStatus.CANCELADO
    },
    {
      icon: 'cancel',
      label: 'Cancelar',
      color: 'warn',
      action: (row) => this.cancel(row),
      show: (row) => row.estado !== BookingStatus.CANCELADO
    }
  ];

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    const fecha = this.selectedDate.toISOString().split('T')[0];
    
    this.bookingService.getBookingsByDate(fecha).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.notificationService.showError('Error al cargar los turnos');
      }
    });
  }

  onDateChange(date: Date): void {
    this.selectedDate = date;
    this.loadBookings();
  }

  viewDetails(booking: Booking): void {
    this.router.navigate(['/bookings', booking.id]);
  }

  edit(booking: Booking): void {
    this.router.navigate(['/bookings', booking.id, 'edit']);
  }

  registerPayment(booking: Booking): void {
    // TODO: Abrir modal de pago
    this.notificationService.showInfo('Funcionalidad de pago en desarrollo');
  }

  cancel(booking: Booking): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '¿Cancelar turno?',
        message: `¿Estás seguro de cancelar el turno de ${booking.client?.nombre} ${booking.client?.apellido}?`,
        confirmText: 'Sí, cancelar',
        cancelText: 'No',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookingService.cancelBooking(booking.id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Turno cancelado correctamente');
            this.loadBookings();
          }
        });
      }
    });
  }

  newBooking(): void {
    this.router.navigate(['/bookings/new']);
  }
}
