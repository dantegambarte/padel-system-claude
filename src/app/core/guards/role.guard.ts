import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Guard que protege rutas según el rol del usuario
 * Usado para restringir secciones solo a administradores
 */
@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Obtener roles permitidos desde la configuración de la ruta
    const allowedRoles = route.data['roles'] as string[];
    const userRole = this.authService.getUserRole();

    if (!allowedRoles || allowedRoles.length === 0) {
      // Si no se especificaron roles, permitir acceso
      return true;
    }

    if (allowedRoles.includes(userRole!)) {
      return true;
    }

    // Usuario sin permisos suficientes
    this.notificationService.showError(
      'No tienes permisos para acceder a esta sección',
    );
    this.router.navigate(['/dashboard']);

    return false;
  }
}
