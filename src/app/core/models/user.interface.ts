/**
 * Modelo de Usuario del sistema
 */
export interface User {
  id: string;
  username: string;
  email: string;
  rol: UserRole;
  nombre_completo: string;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Roles disponibles en el sistema
 */
export enum UserRole {
  ADMIN = 'admin',
  RECEPCIONISTA = 'recepcionista'
}

/**
 * DTO para login
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Respuesta del endpoint de login
 */
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * DTO para crear/actualizar usuario (solo admin)
 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  rol: UserRole;
  nombre_completo: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  nombre_completo?: string;
  activo?: boolean;
}
