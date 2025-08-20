import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment, AppointmentStatus } from '../models';
import { GetAllAppointmentsUseCase, GetAppointmentByIdUseCase, GetAppointmentsByClientUseCase, GetAppointmentsByTechnicianUseCase, CreateAppointmentUseCase, UpdateAppointmentStatusUseCase, UpdateAppointmentUseCase, CancelAppointmentUseCase } from '../core/application/use-cases/appointments';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(
    private getAllAppointmentsUseCase: GetAllAppointmentsUseCase,
    private getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
    private getAppointmentsByClientUseCase: GetAppointmentsByClientUseCase,
    private getAppointmentsByTechnicianUseCase: GetAppointmentsByTechnicianUseCase,
    private createAppointmentUseCase: CreateAppointmentUseCase,
    private updateAppointmentStatusUseCase: UpdateAppointmentStatusUseCase,
    private updateAppointmentUseCase: UpdateAppointmentUseCase,
    private cancelAppointmentUseCase: CancelAppointmentUseCase
  ) {}

  // Primary English interface methods using Clean Architecture
  getAppointments(): Observable<Appointment[]> {
    return this.getAllAppointmentsUseCase.execute();
  }

  getAppointmentById(id: string): Observable<Appointment | null> {
    return this.getAppointmentByIdUseCase.execute(id);
  }

  getAppointmentsByClient(clientId: string): Observable<Appointment[]> {
    return this.getAppointmentsByClientUseCase.execute(clientId);
  }

  getAppointmentsByTechnician(technicianId: string): Observable<Appointment[]> {
    return this.getAppointmentsByTechnicianUseCase.execute(technicianId);
  }

  createAppointment(appointment: Omit<Appointment, 'id' | 'status'>): Observable<Appointment> {
    return this.createAppointmentUseCase.execute(appointment);
  }  updateAppointmentStatus(id: string, status: AppointmentStatus): Observable<Appointment | null> {
    return this.updateAppointmentStatusUseCase.execute(id, status);
  }

  cancelAppointment(appointmentId: string): Observable<boolean> {
    return this.cancelAppointmentUseCase.execute(appointmentId);
  }

  // Legacy methods for backward compatibility
  updateClientInAppointment(appointmentId: string, clientId: string): void {
    this.updateAppointmentUseCase.execute(appointmentId, { clientId }).subscribe();
  }
}
