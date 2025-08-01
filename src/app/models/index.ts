// Modelos para la aplicación de servicios técnicos

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

export enum ServiceCategory {
  MAINTENANCE = 'Maintenance',
  REPAIR = 'Repair',
  INSTALLATION = 'Installation',
  CLEANING = 'Cleaning'
}

export enum EquipmentType {
  COMPUTER = 'Computadora',
  LAPTOP = 'Laptop',
  PRINTER = 'Impresora',
  PHONE = 'Teléfono',
  TABLET = 'Tablet',
  TELEVISION = 'Televisor',
  AIR_CONDITIONER = 'Aire Acondicionado',
  REFRIGERATOR = 'Refrigerador',
  WASHING_MACHINE = 'Lavadora',
  OTHER = 'Otro'
}

export enum AppointmentStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELED = 'Canceled'
}
