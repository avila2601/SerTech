import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment } from '../../../core/domain/models/appointment.model';
import { AppointmentRepository } from '../../../core/domain/repositories/appointment.repository';
import { AppointmentStorageRepository } from '../../../core/domain/repositories/storage';
import { CitaData } from '../../../models/data-types';
import { AppointmentStatus } from '../../../models';

@Injectable({
  providedIn: 'root'
})
export class AppointmentJsonRepository extends AppointmentRepository {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);

  constructor(private appointmentStorageRepository: AppointmentStorageRepository) {
    super();
    this.refreshAppointments();
  }

  private refreshAppointments(): void {
    this.appointmentStorageRepository.getAll().subscribe((citas: CitaData[]) => {
      const appointments = citas.map((cita: CitaData) => this.mapCitaToAppointment(cita));
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
    const statusMap: { [key: string]: AppointmentStatus } = {
      'Pendiente': AppointmentStatus.PENDING,
      'Confirmada': AppointmentStatus.CONFIRMED,
      'En Proceso': AppointmentStatus.IN_PROGRESS,
      'Terminada': AppointmentStatus.COMPLETED,
      'Cancelada': AppointmentStatus.CANCELLED
    };
    return statusMap[estado] || AppointmentStatus.PENDING;
  }

  private mapAppointmentToCita(appointment: Partial<Appointment>): Partial<CitaData> {
    const statusMap: { [key in AppointmentStatus]: string } = {
      [AppointmentStatus.PENDING]: 'Pendiente',
      [AppointmentStatus.CONFIRMED]: 'Confirmada',
      [AppointmentStatus.IN_PROGRESS]: 'En Proceso',
      [AppointmentStatus.COMPLETED]: 'Terminada',
      [AppointmentStatus.CANCELLED]: 'Cancelada'
    };

    return {
      id: appointment.id,
      clienteId: appointment.clientId,
      tecnicoId: appointment.technicianId,
      servicioId: appointment.serviceId,
      equipoId: appointment.equipmentId,
      fecha: appointment.date,
      hora: appointment.time,
      estado: appointment.status ? statusMap[appointment.status as AppointmentStatus] : undefined,
      notas: appointment.notes,
      direccion: appointment.address
    };
  }

  getAll(): Observable<Appointment[]> {
    // Siempre obtener datos frescos del backend en lugar de usar cache local
    return this.appointmentStorageRepository.getAll().pipe(
      map((citas: CitaData[]) => {
        const appointments = citas.map((cita: CitaData) => this.mapCitaToAppointment(cita));
        // Actualizar el subject para otros suscriptores
        this.appointmentsSubject.next(appointments);
        return appointments;
      })
    );
  }

  getById(id: string): Observable<Appointment | null> {
    return this.getAll().pipe(
      map(appointments => {
        const appointment = appointments.find(app => app.id === id);
        return appointment || null;
      })
    );
  }

  getByClientId(clientId: string): Observable<Appointment[]> {
    return this.getAll().pipe(
      map(appointments => appointments.filter(app => app.clientId === clientId))
    );
  }

  getByTechnicianId(technicianId: string): Observable<Appointment[]> {
    return this.getAll().pipe(
      map(appointments => appointments.filter(app => app.technicianId === technicianId))
    );
  }

  create(appointment: Omit<Appointment, 'id' | 'status'>): Observable<Appointment> {
    // Convert English appointment to Spanish format for storage
    const citaData: Omit<CitaData, 'id' | 'estado'> = {
      clienteId: appointment.clientId,
      tecnicoId: appointment.technicianId,
      servicioId: appointment.serviceId,
      equipoId: appointment.equipmentId,
      fecha: appointment.date,
      hora: appointment.time,
      notas: appointment.notes,
      direccion: appointment.address
    };

    return this.appointmentStorageRepository.create(citaData).pipe(
      map((createdCita: CitaData) => {
        const convertedAppointment = this.mapCitaToAppointment(createdCita);

        // Refresh the local cache
        this.refreshAppointments();

        return convertedAppointment;
      })
    );
  }  updateStatus(id: string, status: AppointmentStatus): Observable<Appointment | null> {
    const statusMap: { [key in AppointmentStatus]: string } = {
      [AppointmentStatus.PENDING]: 'Pendiente',
      [AppointmentStatus.CONFIRMED]: 'Confirmada',
      [AppointmentStatus.IN_PROGRESS]: 'En Proceso',
      [AppointmentStatus.COMPLETED]: 'Terminada',
      [AppointmentStatus.CANCELLED]: 'Cancelada'
    };

    const spanishStatus = statusMap[status];

    return this.appointmentStorageRepository.updateStatus(id, status).pipe(
      map((updatedAppointment: CitaData | null) => {
        this.refreshAppointments();
        return updatedAppointment ? this.mapCitaToAppointment(updatedAppointment) : null;
      })
    );
  }

  update(id: string, data: Partial<Appointment>): Observable<Appointment | null> {
    const citaData = this.mapAppointmentToCita(data);

    return this.appointmentStorageRepository.update(id, citaData).pipe(
      map((updatedCita: CitaData | null) => {
        this.refreshAppointments();
        return updatedCita ? this.mapCitaToAppointment(updatedCita) : null;
      })
    );
  }

  cancel(id: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.appointmentStorageRepository.cancel(id).subscribe(() => {
        this.refreshAppointments();
        observer.next(true);
        observer.complete();
      });
    });
  }

  delete(id: string): Observable<boolean> {
    // TODO: Implement appointment deletion through AppointmentStorageRepository
    return new Observable<boolean>(observer => {
      console.warn('Delete appointment not yet implemented');
      observer.next(false);
      observer.complete();
    });
  }
}
