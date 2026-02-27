import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

/**
 * Configuración de rutas principal de la aplicación
 * Estructura:
 * - /auth/* → AuthLayout (sin navbar/sidebar)
 * - /* → MainLayout (con navbar/sidebar + AuthGuard)
 */
const routes: Routes = [
  // Redirección inicial
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // ========================================
  // RUTAS SIN AUTENTICACIÓN (Auth Layout)
  // ========================================
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },

  // ========================================
  // RUTAS AUTENTICADAS (Main Layout)
  // ========================================
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Dashboard (Home)
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },

      // Gestión de Turnos
      {
        path: 'bookings',
        loadChildren: () => import('./features/bookings/bookings.module').then(m => m.BookingsModule)
      },

      // Gestión de Clientes
      {
        path: 'clients',
        loadChildren: () => import('./features/clients/clients.module').then(m => m.ClientsModule)
      },

      // Gestión de Canchas (Solo Admin)
      {
        path: 'courts',
        loadChildren: () => import('./features/courts/courts.module').then(m => m.CourtsModule),
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },

      // Gestión de Productos (Buffet)
      {
        path: 'products',
        loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule)
      },

      // Historial de Ventas
      {
        path: 'sales',
        loadChildren: () => import('./features/sales/sales.module').then(m => m.SalesModule)
      },

      // Caja
      {
        path: 'cash-register',
        loadChildren: () => import('./features/cash-register/cash-register.module').then(m => m.CashRegisterModule)
      },

      // Reportes (Solo Admin)
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule),
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      }
    ]
  },

  // ========================================
  // RUTA 404 - Redirección
  // ========================================
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Configuraciones opcionales
    useHash: false, // true si usas HashLocationStrategy
    enableTracing: false, // true para debug de rutas
    scrollPositionRestoration: 'top' // Scroll al top al cambiar de ruta
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
