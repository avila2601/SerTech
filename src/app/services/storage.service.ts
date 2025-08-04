import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Appointment, Client, AppointmentStatus } from '../models';
import { CitaData, ClienteData } from '../models/data-types';

interface DataStorage {
  citas: CitaData[];
  clientes: ClienteData[];
  ultimoIdCliente: number;
  ultimoIdCita: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'sertech_data';
  private data: DataStorage = {
    citas: [],
    clientes: [],
    ultimoIdCliente: 0,
    ultimoIdCita: 0
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

  updateAppointment(appointmentId: string, update: Partial<CitaData>): Observable<void> {
    const index = this.data.citas.findIndex(c => c.id === appointmentId);
    if (index !== -1) {
      this.data.citas[index] = { ...this.data.citas[index], ...update };
      this.saveData();
      return of(void 0);
    }
    return of(void 0);
  }

  // Métodos para clientes
  getClients(): Observable<ClienteData[]> {
    return this.http.get<ClienteData[]>('https://sertech-backend.onrender.com/clientes');
  }

  addClient(client: Omit<ClienteData, 'id'>): Observable<ClienteData> {
    return this.http.get<ClienteData[]>('https://sertech-backend.onrender.com/clientes').pipe(
      switchMap((clients: ClienteData[]) => {
        // Asegurar que clientes sea un array
        if (!Array.isArray(clients)) {
          clients = [];
        }
        // Calcular el nuevo ID
        const newId = clients.length > 0 ? (Math.max(...clients.map(c => +c.id)) + 1).toString() : '1';
        const newClient: ClienteData = {
          ...client,
          id: newId
        };
        const updatedClients = [...clients, newClient];
        return this.http.put<ClienteData[]>(
          'https://sertech-backend.onrender.com/clientes',
          updatedClients
        ).pipe(map(() => newClient));
      })
    );
  }

  getClientById(id: string): ClienteData | undefined {
    return this.data.clientes.find(client => client.id === id);
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
          'https://sertech-backend.onrender.com/clientes',
          updatedClients
        ).pipe(map(() => updatedClient));
      })
    );
  }

  // Métodos para citas
  getAppointments(): Observable<CitaData[]> {
    return this.http.get<CitaData[]>('https://sertech-backend.onrender.com/citas');
  }

  getAppointmentsByClient(clientId: string): Observable<CitaData[]> {
    const clientAppointments = this.data.citas.filter(appointment => appointment.clienteId === clientId);
    return of(clientAppointments);
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
        const newAppointment: CitaData = {
          ...appointment,
          id: newId,
          estado: AppointmentStatus.PENDING
        };
        const updatedAppointments = [...appointments, newAppointment];
        // Hacer PUT al backend con el array actualizado
        return this.http.put<CitaData[]>(
          'https://sertech-backend.onrender.com/citas',
          updatedAppointments
        ).pipe(map(() => newAppointment));
      })
    );
  }

  /**
   * Envía el JSON actualizado de citas al archivo assets/data/citas.json usando PUT
   * (esto solo funcionará si hay un backend que acepte la petición)
   */
  putAppointmentsJson(): void {
    const url = 'assets/data/appointments.json';
    this.http.put(url, this.data).subscribe({
      next: () => console.log('Archivo citas.json actualizado'),
      error: err => console.error('Error al actualizar citas.json:', err)
    });
  }

  cancelAppointment(appointmentId: string): void {
    const appointmentIndex = this.data.citas.findIndex(appointment => appointment.id === appointmentId);
    if (appointmentIndex !== -1) {
      this.data.citas[appointmentIndex].estado = AppointmentStatus.CANCELLED;
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
      citas: [],
      clientes: [],
      ultimoIdCliente: 0,
      ultimoIdCita: 0
    };
    this.saveData();
  }
}
