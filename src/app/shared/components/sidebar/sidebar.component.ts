import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  roles?: string[]; // Si no se especifica, disponible para todos
}

/**
 * Componente de barra lateral con menú de navegación
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard'
    },
    {
      icon: 'event',
      label: 'Turnos',
      route: '/bookings'
    },
    {
      icon: 'people',
      label: 'Clientes',
      route: '/clients'
    },
    {
      icon: 'sports_tennis',
      label: 'Canchas',
      route: '/courts',
      roles: ['admin']
    },
    {
      icon: 'shopping_cart',
      label: 'Buffet',
      route: '/products'
    },
    {
      icon: 'receipt',
      label: 'Ventas',
      route: '/sales'
    },
    {
      icon: 'account_balance_wallet',
      label: 'Caja',
      route: '/cash-register'
    },
    {
      icon: 'bar_chart',
      label: 'Reportes',
      route: '/reports',
      roles: ['admin']
    }
  ];

  currentRoute: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Detectar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });

    // Establecer ruta inicial
    this.currentRoute = this.router.url;
  }

  /**
   * Verifica si el usuario tiene acceso a un item del menú
   */
  canAccessMenuItem(item: MenuItem): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true; // Disponible para todos
    }

    const userRole = this.authService.getUserRole();
    return userRole ? item.roles.includes(userRole) : false;
  }

  /**
   * Verifica si una ruta está activa
   */
  isRouteActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  /**
   * Obtiene los items de menú filtrados por rol
   */
  get filteredMenuItems(): MenuItem[] {
    return this.menuItems.filter(item => this.canAccessMenuItem(item));
  }
}
