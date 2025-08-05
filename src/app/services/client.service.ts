import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../models';
import { ClienteData } from '../models/data-types';
import { StorageService } from './storage.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private storageService: StorageService) {}

  // Primary English interface methods
  getClients(): Observable<Client[]> {
    // Use migrated English method from StorageService
    return this.storageService.getClients().pipe(
      map((ClienteData: ClienteData[]) =>
        ClienteData.map(ClienteData => ({
          id: ClienteData.id,
          name: ClienteData.nombre,
          email: ClienteData.email,
          phone: ClienteData.telefono,
          address: ClienteData.direccion
        }) as Client)
      )
    );
  }

  getClientById(id: string): Observable<Client | undefined> {
    const ClienteData = this.storageService.getClientById(id);
    if (!ClienteData) {
      return new Observable(observer => {
        observer.next(undefined);
        observer.complete();
      });
    }

    const client: Client = {
      id: ClienteData.id,
      name: ClienteData.nombre,
      email: ClienteData.email,
      phone: ClienteData.telefono,
      address: ClienteData.direccion
    };

    return new Observable(observer => {
      observer.next(client);
      observer.complete();
    });
  }

  addClient(client: Omit<Client, 'id'>): Observable<Client> {
    console.log('=== CLIENT SERVICE: Iniciando addClient ===');
    console.log('Cliente recibido (English):', client);

    // Convert English client to Spanish format for storage
    const ClienteData: Omit<ClienteData, 'id'> = {
      nombre: client.name,
      email: client.email,
      telefono: client.phone,
      direccion: client.address
    };

    console.log('Cliente convertido (Spanish):', ClienteData);

    return this.storageService.addClient(ClienteData).pipe(
      map((ClienteData: ClienteData) => {
        const convertedClient = {
          id: ClienteData.id,
          name: ClienteData.nombre,
          email: ClienteData.email,
          phone: ClienteData.telefono,
          address: ClienteData.direccion
        } as Client;
        console.log('Cliente retornado (English):', convertedClient);
        return convertedClient;
      })
    );
  }

  updateClient(id: string, data: Partial<Client>): Observable<Client | null> {
    // Convert English data to Spanish format for storage
    const datosClienteData: Partial<ClienteData> = {};
    if (data.name) datosClienteData.nombre = data.name;
    if (data.email) datosClienteData.email = data.email;
    if (data.phone) datosClienteData.telefono = data.phone;
    if (data.address) datosClienteData.direccion = data.address;

    return this.storageService.updateClient(id, datosClienteData).pipe(
      map((ClienteData: ClienteData | null) => {
        if (!ClienteData) return null;
        return {
          id: ClienteData.id,
          name: ClienteData.nombre,
          email: ClienteData.email,
          phone: ClienteData.telefono,
          address: ClienteData.direccion
        } as Client;
      })
    );
  }

  // Backward compatibility Spanish interface methods (deprecated)
  getClienteData(): Observable<ClienteData[]> {
    return this.storageService.getClients();
  }

  getClienteDataById(id: string): ClienteData | undefined {
    return this.storageService.getClientById(id);
  }

  agregarClienteData(ClienteData: Omit<ClienteData, 'id'>): Observable<ClienteData> {
    return this.storageService.addClient(ClienteData);
  }

  actualizarClienteData(id: string, datos: Partial<ClienteData>) {
    return this.storageService.updateClient(id, datos);
  }
}
