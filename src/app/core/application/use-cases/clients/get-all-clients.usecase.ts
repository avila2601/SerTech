import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../../../domain/models/client.model';
import { ClientRepository } from '../../../domain/repositories/client.repository';

@Injectable({
  providedIn: 'root'
})
export class GetAllClientsUseCase {
  constructor(@Inject(ClientRepository) private clientRepository: ClientRepository) {}

  execute(): Observable<Client[]> {
    return this.clientRepository.getAll();
  }
}
