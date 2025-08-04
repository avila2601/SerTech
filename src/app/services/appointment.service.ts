import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Appointment, Cita, AppointmentStatus, EstadoCita } from '../models';
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
    this.storageService.getCitas().subscribe(citas => {
      const appointments = citas.map(this.mapCitaToAppointment);
      this.appointmentsSubject.next(appointments);
    });
  }

  private mapCitaToAppointment(cita: Cita): Appointment {
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

  private mapStatusToEnglish(estado: EstadoCita): AppointmentStatus {
    switch (estado) {
      case EstadoCita.PENDIENTE:
        return AppointmentStatus.PENDING;
      case EstadoCita.CONFIRMADA:
        return AppointmentStatus.CONFIRMED;
      case EstadoCita.EN_PROCESO:
        return AppointmentStatus.IN_PROGRESS;
      case EstadoCita.COMPLETADA:
        return AppointmentStatus.COMPLETED;
      case EstadoCita.CANCELADA:
        return AppointmentStatus.CANCELLED;
      default:
        return AppointmentStatus.PENDING;
    }
  }

  private mapAppointmentToCita(appointment: Partial<Appointment>): Partial<Cita> {
    const cita: Partial<Cita> = {};
    if (appointment.clientId) cita.clienteId = appointment.clientId;
    if (appointment.technicianId) cita.tecnicoId = appointment.technicianId;
    if (appointment.serviceId) cita.servicioId = appointment.serviceId;
    if (appointment.equipmentId) cita.equipoId = appointment.equipmentId;
    if (appointment.date) cita.fecha = appointment.date;
    if (appointment.time) cita.hora = appointment.time;
    if (appointment.notes) cita.notas = appointment.notes;
    if (appointment.address) cita.direccion = appointment.address;
    if (appointment.status) {
      switch (appointment.status) {
        case AppointmentStatus.PENDING:
          cita.estado = EstadoCita.PENDIENTE;
          break;
        case AppointmentStatus.CONFIRMED:
          cita.estado = EstadoCita.CONFIRMADA;
          break;
        case AppointmentStatus.IN_PROGRESS:
          cita.estado = EstadoCita.EN_PROCESO;
          break;
        case AppointmentStatus.COMPLETED:
          cita.estado = EstadoCita.COMPLETADA;
          break;
        case AppointmentStatus.CANCELLED:
          cita.estado = EstadoCita.CANCELADA;
          break;
      }
    }
    return cita;
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointmentsSubject.asObservable();
  }

  getAppointmentsByClient(clientId: string): Observable<Appointment[]> {
    return this.storageService.getCitasPorCliente(clientId).pipe(
      map(citas => citas.map(this.mapCitaToAppointment))
    );
  }

  createAppointment(appointment: Omit<Appointment, 'id' | 'status'>): Observable<Appointment> {
    return new Observable(observer => {
      const citaData = this.mapAppointmentToCita(appointment);
      this.storageService.crearCita(citaData as Omit<Cita, 'id' | 'estado'>).subscribe({
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
    this.storageService.cancelarCita(appointmentId);
    this.refreshAppointments();
  }

  updateClientInAppointment(appointmentId: string, clientId: string): void {
    this.storageService.actualizarCita(appointmentId, { clienteId: clientId }).subscribe(() => {
      this.refreshAppointments();
    });
  }
}
