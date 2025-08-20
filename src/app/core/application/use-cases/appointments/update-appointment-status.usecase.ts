import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../../domain/models/appointment.model';
import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';
import { AppointmentStatus } from '../../../../models';

@Injectable({
  providedIn: 'root'
})
export class UpdateAppointmentStatusUseCase {
  constructor(@Inject(AppointmentRepository) private appointmentRepository: AppointmentRepository) {}

  execute(id: string, status: AppointmentStatus): Observable<Appointment | null> {
    return this.appointmentRepository.updateStatus(id, status);
  }
}
