import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  constructor(private storageService: StorageService) {}

  getClientes(): Observable<Cliente[]> {
    return this.storageService.getClientes();
  }

  getClienteById(id: string): Cliente | undefined {
    return this.storageService.getClienteById(id);
  }

  agregarCliente(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.storageService.agregarCliente(cliente);
  }

  actualizarCliente(id: string, datos: Partial<Cliente>) {
    return this.storageService.actualizarCliente(id, datos);
  }
}
