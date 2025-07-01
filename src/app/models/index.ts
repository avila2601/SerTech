// Modelos para la aplicación de servicios técnicos

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface Tecnico {
  id: string;
  nombre: string;
  especialidad: string;
  calificacion: number;
  disponible: boolean;
  foto?: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionEstimada: number; // en minutos
  categoria: CategoriaServicio;
}

export interface Equipo {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  tipo: TipoEquipo;
  descripcion?: string;
}

export interface Cita {
  id: string;
  clienteId: string;
  tecnicoId: string;
  servicioId: string;
  equipoId?: string;
  fecha: Date;
  hora: string;
  estado: EstadoCita;
  notas?: string;
  direccion?: string;
}

export enum CategoriaServicio {
  MANTENIMIENTO = 'Mantenimiento',
  REPARACION = 'Reparación',
  INSTALACION = 'Instalación',
  LIMPIEZA = 'Limpieza'
}

export enum TipoEquipo {
  COMPUTADORA = 'Computadora',
  LAPTOP = 'Laptop',
  IMPRESORA = 'Impresora',
  TELEFONO = 'Teléfono',
  TABLET = 'Tablet',
  TELEVISOR = 'Televisor',
  AIRE_ACONDICIONADO = 'Aire Acondicionado',
  REFRIGERADOR = 'Refrigerador',
  LAVADORA = 'Lavadora',
  OTRO = 'Otro'
}

export enum EstadoCita {
  PENDIENTE = 'Pendiente',
  CONFIRMADA = 'Confirmada',
  EN_PROCESO = 'En Proceso',
  COMPLETADA = 'Completada',
  CANCELADA = 'Cancelada'
}
