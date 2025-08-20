import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../../domain/models/appointment.model';
import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';

@Injectable({
  providedIn: 'root'
})
export class UpdateAppointmentUseCase {
  constructor(@Inject(AppointmentRepository) private appointmentRepository: AppointmentRepository) {}

  execute(id: string, data: Partial<Appointment>): Observable<Appointment | null> {
    return this.appointmentRepository.update(id, data);
  }
}
