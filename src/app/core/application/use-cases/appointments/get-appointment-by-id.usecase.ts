import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../../domain/models/appointment.model';
import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';

@Injectable({
  providedIn: 'root'
})
export class GetAppointmentByIdUseCase {
  constructor(@Inject(AppointmentRepository) private appointmentRepository: AppointmentRepository) {}

  execute(id: string): Observable<Appointment | null> {
    return this.appointmentRepository.getById(id);
  }
}
