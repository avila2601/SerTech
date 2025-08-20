import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../../../domain/models/client.model';
import { ClientRepository } from '../../../domain/repositories/client.repository';

@Injectable({
  providedIn: 'root'
})
export class UpdateClientUseCase {
  constructor(@Inject(ClientRepository) private clientRepository: ClientRepository) {}

  execute(id: string, data: Partial<Client>): Observable<Client | null> {
    return this.clientRepository.update(id, data);
  }
}
