export interface Booking {
  id: string;
  court_id: string;
  court?: Court;
  client_id: string;
  client?: Client;
  fecha: string | Date;
  hora_inicio: string;
  hora_fin: string;
  estado: BookingStatus;
  monto_total: number;
  monto_seña: number;
  monto_pendiente: number;
  notas?: string;
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
}

export enum BookingStatus {
  RESERVADO = 'reservado',
  SEÑADO = 'señado',
  PAGADO = 'pagado',
  CANCELADO = 'cancelado'
}

export interface Court {
  id: string;
  nombre: string;
  tipo: 'techada' | 'descubierta';
  precio_base: number;
  activa: boolean;
}

export interface Client {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
}

export interface CreateBookingDto {
  court_id: string;
  client_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  monto_total: number;
  monto_seña?: number;
  notas?: string;
}

export interface UpdateBookingDto {
  fecha?: string;
  hora_inicio?: string;
  hora_fin?: string;
  estado?: BookingStatus;
  monto_seña?: number;
  notas?: string;
}
