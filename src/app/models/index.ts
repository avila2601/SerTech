// Models for technical services application

// English interfaces (primary)
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

export interface Review {
  id: string;
  technicianId: string;
  clientId: string;
  clientName: string;
  comment: string;
  rating: number;
  date: string;
}

// Spanish interfaces (backward compatibility)
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
  categoria: ServiceCategory;
}

export interface Equipo {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  tipo: EquipmentType;
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
  estado: AppointmentStatus;
  notas?: string;
  direccion?: string;
}

export interface Resena {
  id: string;
  tecnicoId: string;
  clienteId: string;
  cliente: string;
  comentario: string;
  calificacion: number;
  fecha: string;
}

// Consolidated Enums (English keys with Spanish values for UI)
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

export enum UserType {
  CLIENT = 'Cliente',
  TECHNICIAN = 'Técnico',
  ADMIN = 'Administrador'
}

// Spanish aliases for backward compatibility
export const CategoriaServicio = ServiceCategory;
export const TipoEquipo = EquipmentType;
export const EstadoCita = AppointmentStatus;
export const TipoUsuario = UserType;
