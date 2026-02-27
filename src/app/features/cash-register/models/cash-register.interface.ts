export interface CashRegister {
  id: string;
  fecha: Date | string;
  monto_inicial: number;
  ingresos_turnos: number;
  ingresos_buffet: number;
  total_ingresos: number;
  egresos: number;
  monto_final: number;
  cerrada: boolean;
  cerrada_por?: string;
  cerrada_at?: Date;
  notas?: string;
  movements?: CashMovement[];
  closed_by_user?: any;
}

export interface CashMovement {
  id: string;
  cash_register_id: string;
  tipo: 'ingreso' | 'egreso';
  concepto: string;
  monto: number;
  booking_id?: string;
  sale_id?: string;
  registrado_por: string;
  registered_by?: any;
  notas?: string;
  created_at: Date;
}

export interface OpenCashDto {
  monto_inicial: number;
}

export interface CloseCashDto {
  monto_final_contado: number;
  notas?: string;
}

export interface AddMovementDto {
  tipo: 'ingreso' | 'egreso';
  concepto: string;
  monto: number;
  booking_id?: string;
  sale_id?: string;
  notas?: string;
}
