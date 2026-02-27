export interface Client {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
  dni?: string;
  notas?: string;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateClientDto {
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
  dni?: string;
  notas?: string;
}

export interface UpdateClientDto {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  dni?: string;
  notas?: string;
  activo?: boolean;
}

export interface ClientWithBookings extends Client {
  total_bookings: number;
  last_booking_date?: Date;
}
