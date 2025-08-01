import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Appointment } from '../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);

  constructor(private storageService: StorageService) {
    this.refreshAppointments();
  }

  private refreshAppointments(): void {
    this.storageService.getAppointments().subscribe((appointments: Appointment[]) => {
      this.appointmentsSubject.next(appointments);
    });
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointmentsSubject.asObservable();
  }

  getAppointmentsByClient(clientId: string): Observable<Appointment[]> {
    return this.storageService.getAppointmentsByClient(clientId);
  }

  createAppointment(appointmentData: Omit<Appointment, 'id' | 'status'>): Observable<Appointment> {
    return new Observable(observer => {
      this.storageService.createAppointment(appointmentData).subscribe({
        next: (newAppointment) => {
          observer.next(newAppointment);
          this.refreshAppointments();
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  cancelAppointment(appointmentId: string): void {
    this.storageService.cancelAppointment(appointmentId);
    this.refreshAppointments();
  }

  updateClientInAppointment(appointmentId: string, clientId: string): void {
    this.storageService.updateAppointment(appointmentId, { clientId }).subscribe(() => {
      this.refreshAppointments();
    });
  }
}
