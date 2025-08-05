import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Appointment, AppointmentStatus } from '../models';
import { CitaData } from '../models/data-types';
import { StorageService } from './storage.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);

  constructor(private storageService: StorageService) {
    this.refreshAppointments();
  }

  private refreshAppointments(): void {
    this.storageService.getAppointments().subscribe(citas => {
      const appointments = citas.map(cita => this.mapCitaToAppointment(cita));
      this.appointmentsSubject.next(appointments);
    });
  }

  private mapCitaToAppointment(cita: CitaData): Appointment {
    return {
      id: cita.id,
      clientId: cita.clienteId,
      technicianId: cita.tecnicoId,
      serviceId: cita.servicioId,
      equipmentId: cita.equipoId,
      date: cita.fecha,
      time: cita.hora,
      status: this.mapStatusToEnglish(cita.estado),
      notes: cita.notas,
      address: cita.direccion
    };
  }

  private mapStatusToEnglish(estado: string): AppointmentStatus {
    // Map Spanish status strings to AppointmentStatus enum
    switch (estado) {
      case 'Pendiente':
        return AppointmentStatus.PENDING;
      case 'Confirmada':
        return AppointmentStatus.CONFIRMED;
      case 'En Proceso':
        return AppointmentStatus.IN_PROGRESS;
      case 'Completada':
        return AppointmentStatus.COMPLETED;
      case 'Cancelada':
        return AppointmentStatus.CANCELLED;
      default:
        return AppointmentStatus.PENDING;
    }
  }

  private mapAppointmentToCita(appointment: Partial<Appointment>): Partial<CitaData> {
    const cita: Partial<CitaData> = {};
    if (appointment.clientId) cita.clienteId = appointment.clientId;
    if (appointment.technicianId) cita.tecnicoId = appointment.technicianId;
    if (appointment.serviceId) cita.servicioId = appointment.serviceId;
    if (appointment.equipmentId) cita.equipoId = appointment.equipmentId;
    if (appointment.date) cita.fecha = appointment.date;
    if (appointment.time) cita.hora = appointment.time;
    if (appointment.notes) cita.notas = appointment.notes;
    if (appointment.address) cita.direccion = appointment.address;
    if (appointment.status) {
      // Since EstadoCita is now an alias for AppointmentStatus, direct assignment works
      cita.estado = appointment.status;
    }
    return cita;
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointmentsSubject.asObservable();
  }

  getAppointmentsByClient(clientId: string): Observable<Appointment[]> {
    return this.storageService.getAppointmentsByClient(clientId).pipe(
      map(citas => citas.map(this.mapCitaToAppointment))
    );
  }

  createAppointment(appointment: Omit<Appointment, 'id' | 'status'>): Observable<Appointment> {
    return new Observable(observer => {
      const citaData = this.mapAppointmentToCita(appointment);
      this.storageService.createAppointment(citaData as Omit<CitaData, 'id' | 'estado'>).subscribe({
        next: (nuevaCita) => {
          const newAppointment = this.mapCitaToAppointment(nuevaCita);
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
    this.storageService.updateAppointment(appointmentId, { clienteId: clientId }).subscribe(() => {
      this.refreshAppointments();
    });
  }

  // Backward compatibility Spanish interface methods (deprecated)
  getCitas(): Observable<CitaData[]> {
    return this.storageService.getAppointments();
  }

  getCitasPorCliente(clienteId: string): Observable<CitaData[]> {
    return this.storageService.getAppointmentsByClient(clienteId);
  }

  crearCita(cita: Omit<CitaData, 'id' | 'estado'>): Observable<CitaData> {
    return this.storageService.createAppointment(cita);
  }

  cancelarCita(citaId: string): void {
    this.storageService.cancelAppointment(citaId);
    this.refreshAppointments();
  }

  actualizarClienteEnCita(citaId: string, clienteId: string): void {
    this.storageService.updateAppointment(citaId, { clienteId }).subscribe(() => {
      this.refreshAppointments();
    });
  }
}
