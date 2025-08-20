import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Appointment } from '../../../domain/models/appointment.model';
import { Service } from '../../../domain/models/service.model';
import { Client } from '../../../domain/models/client.model';
import { Technician } from '../../../domain/models/technician.model';

export interface AppointmentDisplayInfo {
  serviceName: string;
  technicianName: string;
  technicianSpecialty: string;
  technicianRating: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  serviceInfo: any;
  status: string;
  statusClass: string;
  formattedDate: string;
}

export interface DisplayDataParams {
  appointment: Appointment;
  services: Service[];
  clients: Client[];
  technicians: Technician[];
}

@Injectable({
  providedIn: 'root'
})
export class GetAppointmentDisplayDataUseCase {

  execute(params: DisplayDataParams): Observable<AppointmentDisplayInfo> {
    const { appointment, services, clients, technicians } = params;

    const service = services.find(s => s.id === appointment.serviceId);
    const technician = technicians.find(t => t.id === appointment.technicianId);
    const client = clients.find(c => c.id === appointment.clientId);

    const displayInfo: AppointmentDisplayInfo = {
      serviceName: service ? service.name : 'Servicio no encontrado',
      technicianName: technician ? technician.name : 'No asignado',
      technicianSpecialty: technician ? technician.specialty : 'No asignado',
      technicianRating: technician ? technician.rating : 0,
      clientName: client ? client.name : 'No disponible',
      clientEmail: client ? client.email : 'No disponible',
      clientPhone: client ? client.phone : 'No disponible',
      clientAddress: client ? client.address : 'No disponible',
      serviceInfo: this.parseServiceInfo(appointment.notes),
      status: this.getAppointmentStatus(appointment),
      statusClass: this.getAppointmentStatusClass(appointment),
      formattedDate: this.formatDate(appointment.date)
    };

    return of(displayInfo);
  }

  private parseServiceInfo(notes?: string): any {
    try {
      if (notes) {
        return JSON.parse(notes);
      }
    } catch (error) {
      console.error('Error parsing service info:', error);
    }
    return {};
  }

  private getAppointmentStatus(appointment: Appointment): string {
    const appointmentDate = new Date(appointment.date);
    const [hours, minutes] = appointment.time.split(':').map(Number);

    // Create full date with hours and minutes
    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const currentDateTime = new Date();

    // If date and time have passed, it's completed
    if (appointmentDateTime < currentDateTime) {
      return 'Terminada';
    }
    return 'Pendiente';
  }

  private getAppointmentStatusClass(appointment: Appointment): string {
    const status = this.getAppointmentStatus(appointment);
    return status === 'Pendiente' ? 'pending' : 'completed';
  }

  private formatDate(date: Date): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
