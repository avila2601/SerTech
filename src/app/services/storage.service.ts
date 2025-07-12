import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Cita, Cliente, EstadoCita } from '../models';

interface DataStorage {
  citas: Cita[];
  clientes: Cliente[];
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

  // Métodos para clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>('https://sertech-backend.onrender.com/clientes');
  }

  agregarCliente(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.http.get<Cliente[]>('https://sertech-backend.onrender.com/clientes').pipe(
      switchMap((clientes: Cliente[]) => {
        // Asegurar que clientes sea un array
        if (!Array.isArray(clientes)) {
          clientes = [];
        }
        // Calcular el nuevo ID
        const nuevoId = clientes.length > 0 ? (Math.max(...clientes.map(c => +c.id)) + 1).toString() : '1';
        const nuevoCliente: Cliente = {
          ...cliente,
          id: nuevoId
        };
        const clientesActualizados = [...clientes, nuevoCliente];
        return this.http.put<Cliente[]>(
          'https://sertech-backend.onrender.com/clientes',
          clientesActualizados
        ).pipe(map(() => nuevoCliente));
      })
    );
  }

  getClienteById(id: string): Cliente | undefined {
    return this.data.clientes.find(cliente => cliente.id === id);
  }

  actualizarCliente(id: string, datos: Partial<Cliente>): Observable<Cliente | null> {
    return this.getClientes().pipe(
      switchMap((clientes: Cliente[]) => {
        const idx = clientes.findIndex(c => c.id === id);
        if (idx === -1) return of(null);
        const clienteActualizado = { ...clientes[idx], ...datos };
        const clientesActualizados = [...clientes];
        clientesActualizados[idx] = clienteActualizado;
        return this.http.put<Cliente[]>(
          'https://sertech-backend.onrender.com/clientes',
          clientesActualizados
        ).pipe(map(() => clienteActualizado));
      })
    );
  }

  // Métodos para citas
  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>('https://sertech-backend.onrender.com/citas');
  }

  getCitasPorCliente(clienteId: string): Observable<Cita[]> {
    const citasCliente = this.data.citas.filter(cita => cita.clienteId === clienteId);
    return of(citasCliente);
  }

  crearCita(cita: Omit<Cita, 'id' | 'estado'>): Observable<Cita> {
    // Obtener todas las citas actuales del backend
    return this.getCitas().pipe(
      switchMap((citas: Cita[]) => {
        // Asegurar que citas sea un array
        if (!Array.isArray(citas)) {
          citas = [];
        }
        // Calcular el nuevo ID
        const nuevoId = citas.length > 0 ? (Math.max(...citas.map(c => +c.id)) + 1).toString() : '1';
        const nuevaCita: Cita = {
          ...cita,
          id: nuevoId,
          estado: EstadoCita.PENDIENTE
        };
        const citasActualizadas = [...citas, nuevaCita];
        // Hacer PUT al backend con el array actualizado
        return this.http.put<Cita[]>(
          'https://sertech-backend.onrender.com/citas',
          citasActualizadas
        ).pipe(map(() => nuevaCita));
      })
    );
  }

  /**
   * Envía el JSON actualizado de citas al archivo assets/data/citas.json usando PUT
   * (esto solo funcionará si hay un backend que acepte la petición)
   */
  putCitasJson(): void {
    const url = 'assets/data/citas.json';
    this.http.put(url, this.data).subscribe({
      next: () => console.log('Archivo citas.json actualizado'),
      error: err => console.error('Error al actualizar citas.json:', err)
    });
  }

  cancelarCita(citaId: string): void {
    const citaIndex = this.data.citas.findIndex(cita => cita.id === citaId);
    if (citaIndex !== -1) {
      this.data.citas[citaIndex].estado = EstadoCita.CANCELADA;
      this.saveData();
    }
  }

  // Método para obtener datos del archivo JSON inicial (opcional)
  loadInitialData(): Observable<DataStorage> {
    return this.http.get<DataStorage>('assets/data/citas.json').pipe(
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
