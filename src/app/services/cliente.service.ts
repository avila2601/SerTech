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

  agregarCliente(cliente: Omit<Cliente, 'id'>): Cliente {
    return this.storageService.agregarCliente(cliente);
  }

  actualizarCliente(id: string, cliente: Partial<Cliente>): boolean {
    // Por ahora mantenemos la funcionalidad básica
    // En una implementación completa, agregaríamos el método al StorageService
    return true;
  }
}
