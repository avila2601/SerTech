import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Cliente } from '../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientesSubject = new BehaviorSubject<Cliente[]>([]);

  constructor(private storageService: StorageService) {
    this.refreshClientes();
  }

  private refreshClientes(): void {
    this.storageService.getClientes().subscribe(clientes => {
      this.clientesSubject.next(clientes);
    });
  }

  getClientes(): Observable<Cliente[]> {
    return this.clientesSubject.asObservable();
  }

  agregarCliente(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    return new Observable(observer => {
      this.storageService.agregarCliente(cliente).subscribe({
        next: (nuevoCliente) => {
          observer.next(nuevoCliente);
          this.refreshClientes();
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  actualizarCliente(id: string, datos: Partial<Cliente>): Observable<Cliente | null> {
    return new Observable(observer => {
      this.storageService.actualizarCliente(id, datos).subscribe({
        next: (cliente) => {
          observer.next(cliente);
          this.refreshClientes();
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}
