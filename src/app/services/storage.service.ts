import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Appointment, Client, AppointmentStatus } from '../models';
import { CitaData, ClienteData } from '../models/data-types';
import { CalculateAppointmentStatusUseCase } from '../core/application/use-cases/appointments';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private http: HttpClient,
    private calculateAppointmentStatusUseCase: CalculateAppointmentStatusUseCase
  ) {}

  // Métodos para clientes
  getClients(): Observable<ClienteData[]> {
    return this.http.get<ClienteData[]>('https://sertech-backend.onrender.com/clients');
  }

  addClient(client: Omit<ClienteData, 'id'>): Observable<ClienteData> {
    console.log('=== STORAGE SERVICE: Iniciando addClient ===');
    console.log('Cliente a agregar:', client);

    return this.http.get<ClienteData[]>('https://sertech-backend.onrender.com/clients').pipe(
      switchMap((clients: ClienteData[]) => {
        console.log('Clientes existentes obtenidos:', clients);
        // Asegurar que clientes sea un array
        if (!Array.isArray(clients)) {
          console.log('Clientes no es array, inicializando como array vacío');
          clients = [];
        }
        // Calcular el nuevo ID
        const newId = clients.length > 0 ? (Math.max(...clients.map(c => +c.id)) + 1).toString() : '1';
        console.log('Nuevo ID calculado:', newId);

        const newClient: ClienteData = {
          ...client,
          id: newId
        };
        console.log('Cliente completo a crear:', newClient);

        const updatedClients = [...clients, newClient];
        console.log('Lista actualizada de clientes:', updatedClients);

        return this.http.put<ClienteData[]>(
          'https://sertech-backend.onrender.com/clients',
          updatedClients
        ).pipe(
          map(() => {
            console.log('Cliente guardado exitosamente en Render');
            return newClient;
          })
        );
      })
    );
  }

  getClientById(id: string): Observable<ClienteData | undefined> {
    return this.getClients().pipe(
      map((clients: ClienteData[]) =>
        clients.find(client => client.id === id)
      )
    );
  }

  updateClient(id: string, data: Partial<ClienteData>): Observable<ClienteData | null> {
    return this.getClients().pipe(
      switchMap((clients: ClienteData[]) => {
        const idx = clients.findIndex(c => c.id === id);
        if (idx === -1) return of(null);
        const updatedClient = { ...clients[idx], ...data };
        const updatedClients = [...clients];
        updatedClients[idx] = updatedClient;
        return this.http.put<ClienteData[]>(
          'https://sertech-backend.onrender.com/clients',
          updatedClients
        ).pipe(map(() => updatedClient));
      })
    );
  }

  // Métodos para citas
  getAppointments(): Observable<CitaData[]> {
    return this.http.get<CitaData[]>('https://sertech-backend.onrender.com/appointments');
  }

  getAppointmentsByClient(clientId: string): Observable<CitaData[]> {
    return this.getAppointments().pipe(
      map((appointments: CitaData[]) =>
        appointments.filter(appointment => appointment.clienteId === clientId)
      )
    );
  }

  createAppointment(appointment: Omit<CitaData, 'id' | 'estado'>): Observable<CitaData> {
    // Obtener todas las citas actuales del backend
    return this.getAppointments().pipe(
      switchMap((appointments: CitaData[]) => {
        // Asegurar que citas sea un array
        if (!Array.isArray(appointments)) {
          appointments = [];
        }
        // Calcular el nuevo ID
        const newId = appointments.length > 0 ? (Math.max(...appointments.map(c => +c.id)) + 1).toString() : '1';

        // Calcular el estado basado en fecha y hora usando Use Case
        const appointmentStatus = this.calculateAppointmentStatusUseCase.execute(appointment.fecha, appointment.hora);

        const newAppointment: CitaData = {
          ...appointment,
          id: newId,
          estado: appointmentStatus
        };
        const updatedAppointments = [...appointments, newAppointment];
        // Hacer PUT al backend con el array actualizado
        return this.http.put<CitaData[]>(
          'https://sertech-backend.onrender.com/appointments',
          updatedAppointments
        ).pipe(map(() => newAppointment));
      })
    );
  }

  updateAppointment(appointmentId: string, update: Partial<CitaData>): Observable<void> {
    return this.getAppointments().pipe(
      switchMap((appointments: CitaData[]) => {
        const index = appointments.findIndex(c => c.id === appointmentId);
        if (index !== -1) {
          appointments[index] = { ...appointments[index], ...update };
          return this.http.put<CitaData[]>(
            'https://sertech-backend.onrender.com/appointments',
            appointments
          ).pipe(map(() => void 0));
        }
        return of(void 0);
      })
    );
  }

  cancelAppointment(appointmentId: string): Observable<void> {
    return this.getAppointments().pipe(
      switchMap((appointments: CitaData[]) => {
        const appointmentIndex = appointments.findIndex(appointment => appointment.id === appointmentId);
        if (appointmentIndex !== -1) {
          appointments[appointmentIndex].estado = AppointmentStatus.CANCELLED;
          return this.http.put<CitaData[]>(
            'https://sertech-backend.onrender.com/appointments',
            appointments
          ).pipe(map(() => void 0));
        }
        return of(void 0);
      })
    );
  }

  // Método para debugging - exportar datos del backend
  exportData(): Observable<string> {
    return this.getAppointments().pipe(
      switchMap(appointments =>
        this.getClients().pipe(
          map(clients => JSON.stringify({ appointments, clients }, null, 2))
        )
      )
    );
  }
}
