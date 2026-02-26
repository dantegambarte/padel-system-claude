import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  User,
  UserRole,
} from '../models/user.interface';
import { ApiResponse } from '../models/api-response.interface';

/**
 * Servicio de autenticación
 * Maneja login, logout, tokens JWT y estado del usuario actual
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = `${environment.storagePrefix}token`;
  private readonly USER_KEY = `${environment.storagePrefix}user`;
  private readonly API_URL = `${environment.apiUrl}/auth`;

  // Observable del usuario actual
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getStoredUser(),
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  // Observable de estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken(),
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // Verificar si el token es válido al iniciar
    this.checkTokenValidity();
  }

  /**
   * Realiza el login del usuario
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.API_URL}/login`, credentials)
      .pipe(
        map((response) => response.data!),
        tap((loginResponse) => {
          this.setSession(loginResponse);
        }),
        catchError((error) => {
          console.error('Error en login:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    // Limpiar storage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Actualizar observables
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // Redirigir al login
    this.router.navigate(['/auth/login']);
  }

  /**
   * Guarda el token y usuario en localStorage
   */
  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));

    this.currentUserSubject.next(authResult.user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Obtiene el token JWT almacenado
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtiene el usuario almacenado
   */
  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parseando usuario del storage:', error);
      return null;
    }
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Verifica si existe un token válido
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Verificar si el token está expirado
    try {
      const payload = this.decodeToken(token);
      const isExpired = payload.exp * 1000 < Date.now();
      return !isExpired;
    } catch (error) {
      return false;
    }
  }

  /**
   * Decodifica el token JWT
   */
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  /**
   * Verifica la validez del token y hace logout si está expirado
   */
  private checkTokenValidity(): void {
    if (!this.hasValidToken() && this.getToken()) {
      console.warn('Token expirado, cerrando sesión...');
      this.logout();
    }
  }

  /**
   * Obtiene el rol del usuario actual
   */
  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user ? user.rol : null;
  }

  /**
   * Verifica si el usuario actual es admin
   */
  isAdmin(): boolean {
    return this.getUserRole() === UserRole.ADMIN;
  }

  /**
   * Verifica si el usuario actual es recepcionista
   */
  isRecepcionista(): boolean {
    return this.getUserRole() === UserRole.RECEPCIONISTA;
  }

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   */
  hasRole(roles: UserRole[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  /**
   * Actualiza el perfil del usuario actual
   */
  updateProfile(updates: Partial<User>): Observable<User> {
    return this.http
      .patch<ApiResponse<User>>(`${this.API_URL}/profile`, updates)
      .pipe(
        map((response) => response.data!),
        tap((updatedUser) => {
          // Actualizar usuario en storage y observable
          localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }),
      );
  }

  /**
   * Cambia la contraseña del usuario actual
   */
  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(`${this.API_URL}/change-password`, {
        currentPassword,
        newPassword,
      })
      .pipe(map((response) => response.data!));
  }

  /**
   * Refresca el token JWT
   */
  refreshToken(): Observable<string> {
    return this.http
      .post<ApiResponse<{ token: string }>>(`${this.API_URL}/refresh`, {})
      .pipe(
        map((response) => response.data!.token),
        tap((newToken) => {
          localStorage.setItem(this.TOKEN_KEY, newToken);
        }),
      );
  }
}
