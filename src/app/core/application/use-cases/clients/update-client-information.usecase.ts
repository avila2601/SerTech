import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ClientRepository } from '../../../domain/repositories/client.repository';
import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';
import { UserStateService } from '../../../../services/user-state.service';
import { Client } from '../../../domain/models/client.model';

export interface ClientInformationData {
  name: string;
  email: string;
  phone: string;
  address: string;
  date?: string;
  time?: string;
}

export interface UpdateClientResult {
  success: boolean;
  clientId?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateClientInformationUseCase {
  constructor(
    @Inject(ClientRepository) private clientRepository: ClientRepository,
    @Inject(AppointmentRepository) private appointmentRepository: AppointmentRepository,
    private userStateService: UserStateService
  ) {}

  execute(formData: ClientInformationData): Observable<UpdateClientResult> {
    const loggedClientId = localStorage.getItem('loggedClient');
    const appointmentId = localStorage.getItem('appointmentInProcess');

    if (loggedClientId) {
      // Update existing client
      return this.updateExistingClient(loggedClientId, formData, appointmentId);
    } else {
      // For new clients, just return success - client will be created during appointment confirmation
      return of({
        success: true,
        message: 'Cliente preparado para creación'
      });
    }
  }

  private updateExistingClient(
    clientId: string,
    formData: ClientInformationData,
    appointmentId?: string | null
  ): Observable<UpdateClientResult> {
    const clientUpdateData: Partial<Client> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    };

    return this.clientRepository.update(clientId, clientUpdateData).pipe(
      switchMap(updatedClient => {
        if (!updatedClient) {
          return of({
            success: false,
            message: 'Error al actualizar cliente'
          });
        }

        // Update appointment client if needed
        if (appointmentId) {
          return this.updateAppointmentClient(appointmentId, clientId).pipe(
            map(() => ({
              success: true,
              clientId: clientId,
              message: 'Cliente actualizado exitosamente'
            }))
          );
        }

        return of({
          success: true,
          clientId: clientId,
          message: 'Cliente actualizado exitosamente'
        });
      })
    );
  }

  private updateAppointmentClient(appointmentId: string, clientId: string): Observable<boolean> {
    return this.appointmentRepository.getById(appointmentId).pipe(
      switchMap(appointment => {
        if (!appointment) {
          return of(false);
        }

        const updatedAppointment = { ...appointment, clientId };
        return this.appointmentRepository.update(appointmentId, updatedAppointment).pipe(
          map(result => !!result)
        );
      })
    );
  }
}
