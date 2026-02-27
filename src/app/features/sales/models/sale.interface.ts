import { Product } from '../../products/models/product.interface';

export interface Sale {
  id: string;
  booking_id?: string;
  fecha: Date;
  hora: string;
  monto_total: number;
  metodo_pago: PaymentMethod;
  vendedor_id: string;
  vendedor?: { nombre_completo: string };
  items: SaleItem[];
  created_at: Date;
}

export enum PaymentMethod {
  EFECTIVO = 'efectivo',
  TRANSFERENCIA = 'transferencia',
  TARJETA = 'tarjeta'
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product?: Product;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface CreateSaleDto {
  booking_id?: string;
  metodo_pago: PaymentMethod;
  items: CreateSaleItemDto[];
}

export interface CreateSaleItemDto {
  product_id: string;
  cantidad: number;
  precio_unitario: number;
}
