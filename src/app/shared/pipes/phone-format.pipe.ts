import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatear números de teléfono argentinos
 * Uso: {{ '3815123456' | phoneFormat }} → (381) 512-3456
 */
@Pipe({
  name: 'phoneFormat'
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // Remover todos los caracteres no numéricos
    const cleaned = value.replace(/\D/g, '');

    // Si tiene código de país (54), removerlo para el formato
    const phoneNumber = cleaned.startsWith('54') ? cleaned.substring(2) : cleaned;

    // Formato para celulares argentinos (10 dígitos)
    if (phoneNumber.length === 10) {
      const areaCode = phoneNumber.substring(0, 3);
      const firstPart = phoneNumber.substring(3, 6);
      const secondPart = phoneNumber.substring(6, 10);
      return `(${areaCode}) ${firstPart}-${secondPart}`;
    }

    // Formato para teléfonos fijos (8 dígitos con código de área)
    if (phoneNumber.length === 8) {
      const firstPart = phoneNumber.substring(0, 4);
      const secondPart = phoneNumber.substring(4, 8);
      return `${firstPart}-${secondPart}`;
    }

    // Si no coincide con ningún formato, devolver el número limpio
    return phoneNumber;
  }
}
