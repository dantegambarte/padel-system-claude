export interface Court {
  id: string;
  nombre: string;
  tipo: CourtType;
  precio_base: number;
  activa: boolean;
  orden: number;
  created_at: Date;
  updated_at: Date;
}

export enum CourtType {
  TECHADA = 'techada',
  DESCUBIERTA = 'descubierta'
}

export interface CreateCourtDto {
  nombre: string;
  tipo: CourtType;
  precio_base: number;
  orden?: number;
}

export interface UpdateCourtDto {
  nombre?: string;
  tipo?: CourtType;
  precio_base?: number;
  activa?: boolean;
  orden?: number;
}
