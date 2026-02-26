import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatear horas
 * Uso: {{ '14:30:00' | timeFormat }} → 14:30
 */
@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string | Date | null | undefined, includeSeconds: boolean = false): string {
    if (!value) {
      return '';
    }

    let hours: number;
    let minutes: number;
    let seconds: number = 0;

    if (typeof value === 'string') {
      // Formato esperado: "HH:MM:SS" o "HH:MM"
      const parts = value.split(':');
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);
      seconds = parts[2] ? parseInt(parts[2], 10) : 0;
    } else if (value instanceof Date) {
      hours = value.getHours();
      minutes = value.getMinutes();
      seconds = value.getSeconds();
    } else {
      return '';
    }

    // Validar valores
    if (isNaN(hours) || isNaN(minutes)) {
      return '';
    }

    // Formatear con ceros a la izquierda
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    return includeSeconds 
      ? `${hoursStr}:${minutesStr}:${secondsStr}`
      : `${hoursStr}:${minutesStr}`;
  }
}
