import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client } from '../models';
import { GetAllClientsUseCase, GetClientByIdUseCase, GetClientByEmailUseCase, CreateClientUseCase, UpdateClientUseCase } from '../core/application/use-cases/clients';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(
    private getAllClientsUseCase: GetAllClientsUseCase,
    private getClientByIdUseCase: GetClientByIdUseCase,
    private getClientByEmailUseCase: GetClientByEmailUseCase,
    private createClientUseCase: CreateClientUseCase,
    private updateClientUseCase: UpdateClientUseCase
  ) {}

  // Primary English interface methods using Clean Architecture
  getClients(): Observable<Client[]> {
    return this.getAllClientsUseCase.execute();
  }

  getClientById(id: string): Observable<Client | undefined> {
    return this.getClientByIdUseCase.execute(id).pipe(
      map((client: Client | null) => client || undefined)
    );
  }

  getClientByEmail(email: string): Observable<Client | null> {
    return this.getClientByEmailUseCase.execute(email);
  }

  addClient(client: Omit<Client, 'id'>): Observable<Client> {
    console.log('=== CLIENT SERVICE: Iniciando addClient ===');
    console.log('Cliente recibido (English):', client);

    return this.createClientUseCase.execute(client);
  }

  updateClient(id: string, data: Partial<Client>): Observable<Client | null> {
    return this.updateClientUseCase.execute(id, data);
  }
}
