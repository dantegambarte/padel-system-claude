import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatear valores monetarios en pesos argentinos
 * Uso: {{ 1500 | currencyArs }} → $ 1.500,00
 */
@Pipe({
  name: 'currencyArs'
})
export class CurrencyArsPipe implements PipeTransform {
  transform(value: number | null | undefined, showDecimals: boolean = true): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '$ 0,00';
    }

    const decimals = showDecimals ? 2 : 0;
    const formattedValue = value.toLocaleString('es-AR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    return `$ ${formattedValue}`;
  }
}
