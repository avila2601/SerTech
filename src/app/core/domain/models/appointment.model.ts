import { AppointmentStatus } from '../../../models';

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
