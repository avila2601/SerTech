import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../../domain/models/appointment.model';
import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';

@Injectable({
  providedIn: 'root'
})
export class GetAppointmentsByClientUseCase {
  constructor(@Inject(AppointmentRepository) private appointmentRepository: AppointmentRepository) {}

  execute(clientId: string): Observable<Appointment[]> {
    return this.appointmentRepository.getByClientId(clientId);
  }
}
