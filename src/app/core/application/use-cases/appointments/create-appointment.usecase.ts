import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../../domain/models/appointment.model';
import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';

@Injectable({
  providedIn: 'root'
})
export class CreateAppointmentUseCase {
  constructor(@Inject(AppointmentRepository) private appointmentRepository: AppointmentRepository) {}

  execute(appointment: Omit<Appointment, 'id' | 'status'>): Observable<Appointment> {
    return this.appointmentRepository.create(appointment);
  }
}
