// Models for technical services application

// New English interfaces
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  available: boolean;
  photo?: string;
  password: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDuration: number; // in minutes
  category: ServiceCategory;
}

export interface Equipment {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: EquipmentType;
  description?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  technicianId: string;
  serviceId: string;
  equipmentId?: string;
  date: Date;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  address?: string;
}

// Original Spanish interfaces (still active)
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
  contraseña: string;
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

export enum ServiceCategory {
  MAINTENANCE = 'Mantenimiento',
  REPAIR = 'Reparación',
  INSTALLATION = 'Instalación',
  CLEANING = 'Limpieza'
}

export enum EquipmentType {
  COMPUTER = 'Computadora',
  LAPTOP = 'Laptop',
  PRINTER = 'Impresora',
  PHONE = 'Teléfono',
  TABLET = 'Tablet',
  TV = 'Televisor',
  AIR_CONDITIONING = 'Aire Acondicionado',
  REFRIGERATOR = 'Refrigerador',
  WASHING_MACHINE = 'Lavadora',
  OTHER = 'Otro'
}

export enum AppointmentStatus {
  PENDING = 'Pendiente',
  CONFIRMED = 'Confirmada',
  IN_PROGRESS = 'En Proceso',
  COMPLETED = 'Completada',
  CANCELLED = 'Cancelada'
}

// Original Spanish enums for backward compatibility
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
