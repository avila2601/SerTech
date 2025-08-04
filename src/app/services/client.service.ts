import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, Cliente } from '../models';
import { StorageService } from './storage.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private storageService: StorageService) {}

  getClients(): Observable<Client[]> {
    // Temporary: Use Spanish method and map data to English interface
    return this.storageService.getClientes().pipe(
      map((clientes: Cliente[]) =>
        clientes.map(cliente => ({
          id: cliente.id,
          name: cliente.nombre,
          email: cliente.email,
          phone: cliente.telefono,
          address: cliente.direccion
        }) as Client)
      )
    );
  }

  getClientById(id: string): Observable<Client | undefined> {
    const cliente = this.storageService.getClienteById(id);
    if (!cliente) {
      return new Observable(observer => {
        observer.next(undefined);
        observer.complete();
      });
    }

    const client: Client = {
      id: cliente.id,
      name: cliente.nombre,
      email: cliente.email,
      phone: cliente.telefono,
      address: cliente.direccion
    };

    return new Observable(observer => {
      observer.next(client);
      observer.complete();
    });
  }

  addClient(client: Omit<Client, 'id'>): Observable<Client> {
    // Convert English client to Spanish format for storage
    const clienteData: Omit<Cliente, 'id'> = {
      nombre: client.name,
      email: client.email,
      telefono: client.phone,
      direccion: client.address
    };

    return this.storageService.agregarCliente(clienteData).pipe(
      map((cliente: Cliente) => ({
        id: cliente.id,
        name: cliente.nombre,
        email: cliente.email,
        phone: cliente.telefono,
        address: cliente.direccion
      }) as Client)
    );
  }

  updateClient(id: string, data: Partial<Client>): Observable<Client | null> {
    // Convert English data to Spanish format for storage
    const datosCliente: Partial<Cliente> = {};
    if (data.name) datosCliente.nombre = data.name;
    if (data.email) datosCliente.email = data.email;
    if (data.phone) datosCliente.telefono = data.phone;
    if (data.address) datosCliente.direccion = data.address;

    return this.storageService.actualizarCliente(id, datosCliente).pipe(
      map((cliente: Cliente | null) => {
        if (!cliente) return null;
        return {
          id: cliente.id,
          name: cliente.nombre,
          email: cliente.email,
          phone: cliente.telefono,
          address: cliente.direccion
        } as Client;
      })
    );
  }
}
