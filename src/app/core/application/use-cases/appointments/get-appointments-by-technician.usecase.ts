import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../../domain/models/appointment.model';
import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';

@Injectable({
  providedIn: 'root'
})
export class GetAppointmentsByTechnicianUseCase {
  constructor(@Inject(AppointmentRepository) private appointmentRepository: AppointmentRepository) {}

  execute(technicianId: string): Observable<Appointment[]> {
    return this.appointmentRepository.getByTechnicianId(technicianId);
  }
}
