import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../../../domain/models/client.model';
import { ClientRepository } from '../../../domain/repositories/client.repository';

@Injectable({
  providedIn: 'root'
})
export class CreateClientUseCase {
  constructor(@Inject(ClientRepository) private clientRepository: ClientRepository) {}

  execute(client: Omit<Client, 'id'>): Observable<Client> {
    return this.clientRepository.create(client);
  }
}
