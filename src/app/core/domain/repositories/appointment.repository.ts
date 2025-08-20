import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { AppointmentStatus } from '../../../models';

export abstract class AppointmentRepository {
  abstract getAll(): Observable<Appointment[]>;
  abstract getById(id: string): Observable<Appointment | null>;
  abstract getByClientId(clientId: string): Observable<Appointment[]>;
  abstract getByTechnicianId(technicianId: string): Observable<Appointment[]>;
  abstract create(appointment: Omit<Appointment, 'id' | 'status'>): Observable<Appointment>;
  abstract updateStatus(id: string, status: AppointmentStatus): Observable<Appointment | null>;
  abstract update(id: string, data: Partial<Appointment>): Observable<Appointment | null>;
  abstract cancel(id: string): Observable<boolean>;
  abstract delete(id: string): Observable<boolean>;
}
