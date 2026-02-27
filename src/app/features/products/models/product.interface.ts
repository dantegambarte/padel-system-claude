export interface Product {
  id: string;
  nombre: string;
  categoria: ProductCategory;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  requiere_stock: boolean;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}

export enum ProductCategory {
  BEBIDA = 'bebida',
  COMIDA = 'comida',
  ALQUILER = 'alquiler',
  OTRO = 'otro'
}

export interface CreateProductDto {
  nombre: string;
  categoria: ProductCategory;
  precio_venta: number;
  stock_actual?: number;
  stock_minimo?: number;
  requiere_stock?: boolean;
}

export interface UpdateProductDto {
  nombre?: string;
  categoria?: ProductCategory;
  precio_venta?: number;
  stock_actual?: number;
  stock_minimo?: number;
  requiere_stock?: boolean;
  activo?: boolean;
}

export interface StockAdjustment {
  product_id: string;
  cantidad: number;
  tipo: 'ingreso' | 'egreso';
  motivo?: string;
}
