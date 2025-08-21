import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Client } from '../../../core/domain/models/client.model';
import { ClientRepository } from '../../../core/domain/repositories/client.repository';
import { ClientStorageRepository } from '../../../core/domain/repositories/storage';
import { ClienteData } from '../../../models/data-types';

@Injectable({
  providedIn: 'root'
})
export class ClientJsonRepository extends ClientRepository {
  constructor(private clientStorageRepository: ClientStorageRepository) {
    super();
  }

  getAll(): Observable<Client[]> {
    return this.clientStorageRepository.getAll().pipe(
      map((clienteData: ClienteData[]) =>
        clienteData.map(this.mapToClient)
      )
    );
  }

  getById(id: string): Observable<Client | null> {
    return this.getAll().pipe(
      map(clients => {
        const client = clients.find(client => client.id === id);
        return client || null;
      })
    );
  }

  getByEmail(email: string): Observable<Client | null> {
    return this.getAll().pipe(
      map(clients => {
        const client = clients.find(client => client.email === email);
        return client || null;
      })
    );
  }

  create(client: Omit<Client, 'id'>): Observable<Client> {
    // Convert English client to Spanish format for storage
    const clienteData: Omit<ClienteData, 'id'> = {
      nombre: client.name,
      email: client.email,
      telefono: client.phone,
      direccion: client.address
    };

    return this.clientStorageRepository.create(clienteData).pipe(
      map((createdClienteData: ClienteData) => {
        const convertedClient = this.mapToClient(createdClienteData);
        return convertedClient;
      })
    );
  }

  update(id: string, data: Partial<Client>): Observable<Client | null> {
    // Convert English data to Spanish format for storage
    const datosClienteData: Partial<ClienteData> = {};
    if (data.name) datosClienteData.nombre = data.name;
    if (data.email) datosClienteData.email = data.email;
    if (data.phone) datosClienteData.telefono = data.phone;
    if (data.address) datosClienteData.direccion = data.address;

    return this.clientStorageRepository.update(id, datosClienteData).pipe(
      map((updatedClienteData: ClienteData | null) => {
        if (!updatedClienteData) return null;
        return this.mapToClient(updatedClienteData);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    return this.clientStorageRepository.delete(id);
  }

  private mapToClient(clienteData: ClienteData): Client {
    return {
      id: clienteData.id,
      name: clienteData.nombre,
      email: clienteData.email,
      phone: clienteData.telefono,
      address: clienteData.direccion
    };
  }
}
