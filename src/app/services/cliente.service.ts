import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cliente } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientes: Cliente[] = [
    {
      id: '1',
      nombre: 'Juan Pérez',
      email: 'juan.perez@email.com',
      telefono: '555-0101',
      direccion: 'Calle Principal 123, Ciudad'
    }
  ];

  private clientesSubject = new BehaviorSubject<Cliente[]>(this.clientes);

  constructor() {}

  getClientes(): Observable<Cliente[]> {
    return this.clientesSubject.asObservable();
  }

  getClienteById(id: string): Cliente | undefined {
    return this.clientes.find(cliente => cliente.id === id);
  }

  agregarCliente(cliente: Omit<Cliente, 'id'>): Cliente {
    const nuevoCliente: Cliente = {
      ...cliente,
      id: Date.now().toString()
    };
    this.clientes.push(nuevoCliente);
    this.clientesSubject.next([...this.clientes]);
    return nuevoCliente;
  }

  actualizarCliente(id: string, cliente: Partial<Cliente>): boolean {
    const index = this.clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clientes[index] = { ...this.clientes[index], ...cliente };
      this.clientesSubject.next([...this.clientes]);
      return true;
    }
    return false;
  }
}
