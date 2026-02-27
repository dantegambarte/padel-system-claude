import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { ClientWithBookings } from '../../models/client.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {
  client?: ClientWithBookings;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.params['id'];
    if (clientId) {
      this.loadClient(clientId);
    }
  }

  loadClient(id: string): void {
    this.loading = true;
    this.clientService.getClientWithBookings(id).subscribe({
      next: (client) => {
        this.client = client;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.showError('Error al cargar el cliente');
        this.router.navigate(['/clients']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }

  edit(): void {
    this.router.navigate(['/clients', this.client?.id, 'edit']);
  }
}
