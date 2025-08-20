import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppointmentStorageRepository } from '../../../core/domain/repositories/storage';
import { CitaData } from '../../../models/data-types';
import { AppointmentStatus } from '../../../models';
import { HttpDataSource } from '../http';
import { CalculateAppointmentStatusUseCase } from '../../../core/application/use-cases/appointments';

/**
 * Appointment storage repository implementation using HTTP backend
 */
@Injectable({
  providedIn: 'root'
})
export class StorageAppointmentRepository extends AppointmentStorageRepository {
  private readonly endpoint = 'appointments';

  constructor(
    private httpDataSource: HttpDataSource,
    private calculateAppointmentStatusUseCase: CalculateAppointmentStatusUseCase
  ) {
    super();
  }

  getAll(): Observable<CitaData[]> {
    return this.httpDataSource.get<CitaData[]>(this.endpoint);
  }

  getByClient(clientId: string): Observable<CitaData[]> {
    return this.getAll().pipe(
      map((appointments: CitaData[]) =>
        appointments.filter(appointment => appointment.clienteId === clientId)
      )
    );
  }

  getById(id: string): Observable<CitaData | undefined> {
    return this.getAll().pipe(
      map((appointments: CitaData[]) =>
        appointments.find(appointment => appointment.id === id)
      )
    );
  }

  create(appointment: Omit<CitaData, 'id' | 'estado'>): Observable<CitaData> {
    return this.getAll().pipe(
      switchMap((appointments: CitaData[]) => {
        // Asegurar que citas sea un array
        if (!Array.isArray(appointments)) {
          appointments = [];
        }

        // Calcular el nuevo ID
        const newId = appointments.length > 0
          ? (Math.max(...appointments.map(c => +c.id)) + 1).toString()
          : '1';

        // Calcular el estado basado en fecha y hora usando Use Case
        const appointmentStatus = this.calculateAppointmentStatusUseCase.execute(
          appointment.fecha,
          appointment.hora
        );

        const newAppointment: CitaData = {
          ...appointment,
          id: newId,
          estado: appointmentStatus
        };

        const updatedAppointments = [...appointments, newAppointment];

        return this.httpDataSource.put<CitaData[]>(this.endpoint, updatedAppointments).pipe(
          map(() => newAppointment)
        );
      })
    );
  }

  update(id: string, data: Partial<CitaData>): Observable<CitaData | null> {
    return this.getAll().pipe(
      switchMap((appointments: CitaData[]) => {
        const idx = appointments.findIndex(c => c.id === id);
        if (idx === -1) return of(null);

        const updatedAppointment = { ...appointments[idx], ...data };
        const updatedAppointments = [...appointments];
        updatedAppointments[idx] = updatedAppointment;

        return this.httpDataSource.put<CitaData[]>(this.endpoint, updatedAppointments).pipe(
          map(() => updatedAppointment)
        );
      })
    );
  }

  updateStatus(id: string, status: AppointmentStatus): Observable<CitaData | null> {
    // Mapear el status de enum a string español
    const statusMap: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'pendiente',
      [AppointmentStatus.CONFIRMED]: 'confirmada',
      [AppointmentStatus.IN_PROGRESS]: 'en proceso',
      [AppointmentStatus.COMPLETED]: 'completada',
      [AppointmentStatus.CANCELLED]: 'cancelada'
    };

    const spanishStatus = statusMap[status];
    return this.update(id, { estado: spanishStatus });
  }

  cancel(id: string): Observable<void> {
    return this.getAll().pipe(
      switchMap((appointments: CitaData[]) => {
        const appointmentIndex = appointments.findIndex(appointment => appointment.id === id);
        if (appointmentIndex !== -1) {
          appointments[appointmentIndex].estado = AppointmentStatus.CANCELLED;
          return this.httpDataSource.put<CitaData[]>(this.endpoint, appointments).pipe(
            map(() => void 0)
          );
        }
        return of(void 0);
      })
    );
  }
}
