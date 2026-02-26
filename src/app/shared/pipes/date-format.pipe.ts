import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatear fechas en español
 * Uso: {{ date | dateFormat }} → 'Lun, 15 de Ene 2024'
 */
@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  private readonly daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  private readonly months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  transform(value: string | Date | null | undefined, format: 'short' | 'long' | 'date-only' = 'short'): string {
    if (!value) {
      return '';
    }

    const date = typeof value === 'string' ? new Date(value) : value;
    
    if (isNaN(date.getTime())) {
      return '';
    }

    const dayOfWeek = this.daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = this.months[date.getMonth()];
    const year = date.getFullYear();

    switch (format) {
      case 'short':
        return `${dayOfWeek}, ${day} de ${month}`;
      case 'long':
        return `${dayOfWeek}, ${day} de ${month} de ${year}`;
      case 'date-only':
        return `${day}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${year}`;
      default:
        return `${dayOfWeek}, ${day} de ${month}`;
    }
  }
}
