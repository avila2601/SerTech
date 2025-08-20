import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../../../domain/models/client.model';
import { ClientRepository } from '../../../domain/repositories/client.repository';

@Injectable({
  providedIn: 'root'
})
export class GetClientByEmailUseCase {
  constructor(@Inject(ClientRepository) private clientRepository: ClientRepository) {}

  execute(email: string): Observable<Client | null> {
    return this.clientRepository.getByEmail(email);
  }
}
