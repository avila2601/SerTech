import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';
import { ClientRepository } from '../../../domain/repositories/client.repository';
import { UserStateService } from '../../services/user-state.service';
import { Client, Appointment } from '../../../../models';

export interface AppointmentSummaryData {
  brand: string;
  product: string;
  model: string;
  symptoms: string;
  location: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  technicianId: string;
  serviceId: string;
}

export interface CreateAppointmentResult {
  success: boolean;
  appointment?: Appointment;
  clientId?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateAppointmentFromSummaryUseCase {

  constructor(
    private appointmentRepository: AppointmentRepository,
    private clientRepository: ClientRepository,
    private userStateService: UserStateService
  ) {}

  execute(data: AppointmentSummaryData): Observable<CreateAppointmentResult> {
    // Check if client is already logged in
    const currentUser = this.userStateService.getCurrentUserState();

    if (currentUser.isLoggedIn && currentUser.userId) {
      // Use existing logged client
      return this.createAppointmentWithExistingClient(currentUser.userId, data);
    } else {
      // Create new client first, then appointment
      return this.createAppointmentWithNewClient(data);
    }
  }

  private createAppointmentWithExistingClient(
    clientId: string,
    data: AppointmentSummaryData
  ): Observable<CreateAppointmentResult> {
    const appointmentData = this.buildAppointmentData(clientId, data);

    return this.appointmentRepository.create(appointmentData).pipe(
      map(appointment => ({
        success: true,
        appointment,
        clientId
      }))
    );
  }

  private createAppointmentWithNewClient(data: AppointmentSummaryData): Observable<CreateAppointmentResult> {
    const clientData: Omit<Client, 'id'> = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address
    };

    return this.clientRepository.create(clientData).pipe(
      switchMap((createdClient: Client) => {
        // Update user state to logged in
        this.userStateService.loginClient(createdClient.id, createdClient.email);

        const appointmentData = this.buildAppointmentData(createdClient.id, data);

        return this.appointmentRepository.create(appointmentData).pipe(
          map(appointment => ({
            success: true,
            appointment,
            clientId: createdClient.id
          }))
        );
      })
    );
  }

  private buildAppointmentData(clientId: string, data: AppointmentSummaryData): Omit<Appointment, 'id' | 'status'> {
    // Create service info object with all the details
    const serviceInfo = {
      brand: data.brand,
      product: data.product,
      model: data.model,
      symptoms: data.symptoms,
      location: data.location
    };

    // Fix date timezone issue - create date in local timezone
    const dateParts = data.date.split('-'); // Assuming format YYYY-MM-DD
    const localDate = new Date(
      parseInt(dateParts[0]), // year
      parseInt(dateParts[1]) - 1, // month (0-based)
      parseInt(dateParts[2]) // day
    );

    return {
      clientId: clientId,
      technicianId: data.technicianId,
      serviceId: data.serviceId,
      equipmentId: undefined,
      date: localDate,
      time: data.time,
      notes: JSON.stringify(serviceInfo), // Store service info as JSON string
      address: data.location
    };
  }
}
