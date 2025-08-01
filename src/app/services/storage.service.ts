import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Appointment, Client, AppointmentStatus } from '../models';

interface DataStorage {
  appointments: Appointment[];
  clients: Client[];
  lastClientId: number;
  lastAppointmentId: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'sertech_data';
  private data: DataStorage = {
    appointments: [],
    clients: [],
    lastClientId: 0,
    lastAppointmentId: 0
  };

  constructor(private http: HttpClient) {
    this.loadData();
  }

  private loadData(): void {
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      try {
        this.data = JSON.parse(savedData);
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }

  updateAppointment(appointmentId: string, update: Partial<Appointment>): Observable<void> {
    const index = this.data.appointments.findIndex(a => a.id === appointmentId);
    if (index !== -1) {
      this.data.appointments[index] = { ...this.data.appointments[index], ...update } as Appointment;
      this.saveData();
      return of(void 0);
    }
    return of(void 0);
  }

  // Métodos para clientes
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>('https://sertech-backend.onrender.com/clients');
  }

  addClient(client: Omit<Client, 'id'>): Observable<Client> {
    return this.http.get<Client[]>('https://sertech-backend.onrender.com/clients').pipe(
      switchMap((clients: Client[]) => {
        const list = Array.isArray(clients) ? clients : [];
        const newId = list.length > 0 ? (Math.max(...list.map(c => +c.id)) + 1).toString() : '1';
        const newClient: Client = { ...client, id: newId };
        const updatedClients = [...list, newClient];
        return this.http.put<Client[]>(
          'https://sertech-backend.onrender.com/clients',
          updatedClients
        ).pipe(map(() => newClient));
      })
    );
  }

  getClientById(id: string): Client | undefined {
    return this.data.clients.find(client => client.id === id);
  }

  updateClient(id: string, data: Partial<Client>): Observable<Client | null> {
    return this.getClients().pipe(
      switchMap((clients: Client[]) => {
        const idx = clients.findIndex(c => c.id === id);
        if (idx === -1) return of(null);
        const updatedClient = { ...clients[idx], ...data };
        const updatedList = [...clients]; updatedList[idx] = updatedClient;
        return this.http.put<Client[]>(
          'https://sertech-backend.onrender.com/clients',
          updatedList
        ).pipe(map(() => updatedClient));
      })
    );
  }

  // Métodos para citas
  getAppointments(): Observable<Appointment[]> {
    console.log('Making request to Render backend for appointments...');
    return this.http.get<Appointment[]>('https://sertech-backend.onrender.com/appointments').pipe(
      map(appointments => {
        console.log('Appointments received from Render backend:', appointments);
        return appointments;
      }),
      catchError(error => {
        console.error('Error fetching appointments from Render backend:', error);
        return of([]);
      })
    );
  }

  getAppointmentsByClient(clientId: string): Observable<Appointment[]> {
    const clientAppointments = this.data.appointments.filter(a => a.clientId === clientId);
    return of(clientAppointments);
  }

  createAppointment(appointment: Omit<Appointment, 'id' | 'status'>): Observable<Appointment> {
    // Obtener todas las citas actuales del backend
    return this.getAppointments().pipe(
      switchMap((appointments: Appointment[]) => {
        // Ensure array
        if (!Array.isArray(appointments)) {
          appointments = [];
        }
        // Compute new ID
        const newId = appointments.length > 0 ? (Math.max(...appointments.map(a => +a.id)) + 1).toString() : '1';
        const newAppointment: Appointment = {
          ...appointment,
          id: newId,
          status: AppointmentStatus.PENDING
        };
        const updatedAppointments = [...appointments, newAppointment];
        // PUT updated array to backend
        console.log('Sending new appointment to Render backend:', newAppointment);
        return this.http.put<Appointment[]>(
          'https://sertech-backend.onrender.com/appointments',
          updatedAppointments
        ).pipe(
          map(() => {
            console.log('Appointment successfully saved to Render backend');
            return newAppointment;
          }),
          catchError(error => {
            console.error('Error saving appointment to Render backend:', error);
            throw error;
          })
        );
      })
    );
  }

  /**
   * Sends the updated appointments JSON to assets/data/appointments.json via PUT
   * (works only if there is a backend endpoint that accepts the request)
   */
  putAppointmentsJson(): void {
    const url = 'assets/data/appointments.json';
    this.http.put(url, this.data).subscribe({
      next: () => console.log('appointments.json file updated successfully'),
      error: err => console.error('Error updating appointments.json:', err)
    });
  }

  cancelAppointment(appointmentId: string): void {
    const idx = this.data.appointments.findIndex(a => a.id === appointmentId);
    if (idx !== -1) {
      this.data.appointments[idx].status = AppointmentStatus.CANCELED;
      this.saveData();
    }
  }

  // Método para obtener datos del archivo JSON inicial (opcional)
  loadInitialData(): Observable<DataStorage> {
    return this.http.get<DataStorage>('assets/data/appointments.json').pipe(
      map(data => {
        this.data = data;
        this.saveData();
        return data;
      }),
      catchError(error => {
        console.error('Error loading initial data:', error);
        return of(this.data);
      })
    );
  }

  // Método para exportar datos (útil para debugging)
  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  // Método para limpiar datos (útil para testing)
  clearData(): void {
    this.data = {
      appointments: [],
      clients: [],
      lastClientId: 0,
      lastAppointmentId: 0
    };
    this.saveData();
  }
}
