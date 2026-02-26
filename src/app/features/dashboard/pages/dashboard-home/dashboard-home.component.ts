import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.interface';

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  route?: string;
}

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  currentUser: User | null = null;
  
  stats: StatCard[] = [
    {
      title: 'Turnos Hoy',
      value: 12,
      icon: 'event',
      color: '#3f51b5',
      route: '/bookings'
    },
    {
      title: 'Clientes',
      value: 145,
      icon: 'people',
      color: '#4caf50',
      route: '/clients'
    },
    {
      title: 'Ventas Hoy',
      value: '$ 45.600',
      icon: 'attach_money',
      color: '#ff9800',
      route: '/sales'
    },
    {
      title: 'Caja',
      value: '$ 128.400',
      icon: 'account_balance_wallet',
      color: '#f44336',
      route: '/cash-register'
    }
  ];

  quickActions = [
    {
      label: 'Nuevo Turno',
      icon: 'add_circle',
      route: '/bookings/new',
      color: 'primary'
    },
    {
      label: 'Registrar Venta',
      icon: 'shopping_cart',
      route: '/products/pos',
      color: 'accent'
    },
    {
      label: 'Buscar Cliente',
      icon: 'search',
      route: '/clients',
      color: 'primary'
    },
    {
      label: 'Ver Caja',
      icon: 'receipt',
      route: '/cash-register',
      color: 'warn'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  }
}
