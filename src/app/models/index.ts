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
  appointmentId: string;
  technicianId: string;
  clientId: string;
  clientName: string;
  comment: string;
  rating: number;
  date: string;
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
