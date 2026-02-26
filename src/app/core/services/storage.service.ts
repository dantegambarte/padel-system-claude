import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Servicio para manejar localStorage de forma centralizada y tipada
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly prefix = environment.storagePrefix;

  constructor() {}

  /**
   * Guarda un valor en localStorage
   */
  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.getPrefixedKey(key), serializedValue);
    } catch (error) {
      console.error(`Error guardando en localStorage (${key}):`, error);
    }
  }

  /**
   * Obtiene un valor de localStorage
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getPrefixedKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error obteniendo de localStorage (${key}):`, error);
      return null;
    }
  }

  /**
   * Elimina un valor de localStorage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(this.getPrefixedKey(key));
    } catch (error) {
      console.error(`Error eliminando de localStorage (${key}):`, error);
    }
  }

  /**
   * Limpia todos los valores con el prefijo de la app
   */
  clear(): void {
    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  }

  /**
   * Verifica si existe una key en localStorage
   */
  has(key: string): boolean {
    return localStorage.getItem(this.getPrefixedKey(key)) !== null;
  }

  /**
   * Obtiene la key con prefijo
   */
  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Guarda preferencias del usuario
   */
  setUserPreference(key: string, value: any): void {
    this.set(`user_pref_${key}`, value);
  }

  /**
   * Obtiene preferencias del usuario
   */
  getUserPreference<T>(key: string): T | null {
    return this.get<T>(`user_pref_${key}`);
  }

  /**
   * Guarda el último filtro usado en una tabla
   */
  saveTableFilter(tableName: string, filters: any): void {
    this.set(`table_filter_${tableName}`, filters);
  }

  /**
   * Obtiene el último filtro usado en una tabla
   */
  getTableFilter(tableName: string): any {
    return this.get(`table_filter_${tableName}`);
  }
}
