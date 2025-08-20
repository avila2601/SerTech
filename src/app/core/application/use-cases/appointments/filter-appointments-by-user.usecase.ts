import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Appointment } from '../../../domain/models/appointment.model';
import { Client } from '../../../domain/models/client.model';

export interface FilterParams {
  appointments: Appointment[];
  clients: Client[];
  currentClientId?: string | null;
  currentTechnicianId?: string | null;
  filterType: 'ALL' | 'PENDING' | 'COMPLETED';
}

export interface FilterResult {
  filteredAppointments: Appointment[];
  userAppointments: Appointment[];
}

@Injectable({
  providedIn: 'root'
})
export class FilterAppointmentsByUserUseCase {

  execute(params: FilterParams): Observable<FilterResult> {
    // First filter by user
    let userAppointments: Appointment[] = [];

    if (params.currentClientId) {
      userAppointments = params.appointments.filter(
        appointment => appointment.clientId === params.currentClientId
      );
    } else if (params.currentTechnicianId) {
      userAppointments = params.appointments.filter(
        appointment => appointment.technicianId === params.currentTechnicianId
      );
    } else {
      // Filter by email login if available
      const emailLogin = localStorage.getItem('emailLogin');
      if (emailLogin) {
        userAppointments = params.appointments.filter(appointment => {
          const client = params.clients.find(cl => cl.id === appointment.clientId);
          return client?.email === emailLogin;
        });
      } else {
        userAppointments = [...params.appointments];
      }
    }

    // Then filter by status
    let filteredAppointments: Appointment[] = [];

    if (params.filterType === 'ALL') {
      filteredAppointments = userAppointments;
    } else {
      const statusToFilter = params.filterType === 'PENDING' ? 'Pendiente' : 'Terminada';
      filteredAppointments = userAppointments.filter(app =>
        this.getAppointmentStatus(app) === statusToFilter
      );
    }

    return of({
      filteredAppointments,
      userAppointments
    });
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
}
