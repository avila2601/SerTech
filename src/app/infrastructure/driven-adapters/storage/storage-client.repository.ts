import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ClientStorageRepository } from '../../../core/domain/repositories/storage';
import { ClienteData } from '../../../models/data-types';
import { HttpDataSource } from '../http';

/**
 * Client storage repository implementation using HTTP backend
 */
@Injectable({
  providedIn: 'root'
})
export class StorageClientRepository extends ClientStorageRepository {
  private readonly endpoint = 'clients';

  constructor(private httpDataSource: HttpDataSource) {
    super();
  }

  getAll(): Observable<ClienteData[]> {
    return this.httpDataSource.get<ClienteData[]>(this.endpoint);
  }

  getById(id: string): Observable<ClienteData | undefined> {
    return this.getAll().pipe(
      map((clients: ClienteData[]) =>
        clients.find(client => client.id === id)
      )
    );
  }

  create(client: Omit<ClienteData, 'id'>): Observable<ClienteData> {
    console.log('=== STORAGE CLIENT REPOSITORY: Iniciando create ===');
    console.log('Cliente a agregar:', client);

    return this.getAll().pipe(
      switchMap((clients: ClienteData[]) => {
        console.log('Clientes existentes obtenidos:', clients);

        // Asegurar que clientes sea un array
        if (!Array.isArray(clients)) {
          console.log('Clientes no es array, inicializando como array vacío');
          clients = [];
        }

        // Calcular el nuevo ID
        const newId = clients.length > 0
          ? (Math.max(...clients.map(c => +c.id)) + 1).toString()
          : '1';
        console.log('Nuevo ID calculado:', newId);

        const newClient: ClienteData = {
          ...client,
          id: newId
        };
        console.log('Cliente completo a crear:', newClient);

        const updatedClients = [...clients, newClient];
        console.log('Lista actualizada de clientes:', updatedClients);

        return this.httpDataSource.put<ClienteData[]>(this.endpoint, updatedClients).pipe(
          map(() => {
            console.log('Cliente guardado exitosamente en backend');
            return newClient;
          })
        );
      })
    );
  }

  update(id: string, data: Partial<ClienteData>): Observable<ClienteData | null> {
    return this.getAll().pipe(
      switchMap((clients: ClienteData[]) => {
        const idx = clients.findIndex(c => c.id === id);
        if (idx === -1) return of(null);

        const updatedClient = { ...clients[idx], ...data };
        const updatedClients = [...clients];
        updatedClients[idx] = updatedClient;

        return this.httpDataSource.put<ClienteData[]>(this.endpoint, updatedClients).pipe(
          map(() => updatedClient)
        );
      })
    );
  }

  delete(id: string): Observable<boolean> {
    return this.getAll().pipe(
      switchMap((clients: ClienteData[]) => {
        const filteredClients = clients.filter(c => c.id !== id);

        if (filteredClients.length === clients.length) {
          // No se encontró el cliente
          return of(false);
        }

        return this.httpDataSource.put<ClienteData[]>(this.endpoint, filteredClients).pipe(
          map(() => true)
        );
      })
    );
  }
}
