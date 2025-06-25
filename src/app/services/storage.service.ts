import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
    clientes: [
      {
        id: '1',
        nombre: 'Juan Pérez',
        email: 'juan.perez@email.com',
        telefono: '555-0101',
        direccion: 'Calle Principal 123, Ciudad'
      }
    ],
    ultimoIdCliente: 1,
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
    return of([...this.data.clientes]);
  }

  agregarCliente(cliente: Omit<Cliente, 'id'>): Cliente {
    this.data.ultimoIdCliente++;
    const nuevoCliente: Cliente = {
      ...cliente,
      id: this.data.ultimoIdCliente.toString()
    };

    this.data.clientes.push(nuevoCliente);
    this.saveData();
    return nuevoCliente;
  }

  getClienteById(id: string): Cliente | undefined {
    return this.data.clientes.find(cliente => cliente.id === id);
  }

  // Métodos para citas
  getCitas(): Observable<Cita[]> {
    return of([...this.data.citas]);
  }

  getCitasPorCliente(clienteId: string): Observable<Cita[]> {
    const citasCliente = this.data.citas.filter(cita => cita.clienteId === clienteId);
    return of(citasCliente);
  }

  crearCita(cita: Omit<Cita, 'id' | 'estado'>): Cita {
    this.data.ultimoIdCita++;
    const nuevaCita: Cita = {
      ...cita,
      id: this.data.ultimoIdCita.toString(),
      estado: EstadoCita.PENDIENTE
    };

    this.data.citas.push(nuevaCita);
    this.saveData();
    return nuevaCita;
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
      clientes: [
        {
          id: '1',
          nombre: 'Juan Pérez',
          email: 'juan.perez@email.com',
          telefono: '555-0101',
          direccion: 'Calle Principal 123, Ciudad'
        }
      ],
      ultimoIdCliente: 1,
      ultimoIdCita: 0
    };
    this.saveData();
  }
}
