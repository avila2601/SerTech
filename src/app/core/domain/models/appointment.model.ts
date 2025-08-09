export interface Appointment {
  id: string;
  clientId: string;
  technicianId: string;
  serviceId: string;
  equipmentId?: string;
  date: Date;
  time: string;
  status: string;
  notes?: string;
  address?: string;
}
