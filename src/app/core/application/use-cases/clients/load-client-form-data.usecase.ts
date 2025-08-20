import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientRepository } from '../../../domain/repositories/client.repository';

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadClientFormDataUseCase {
  constructor(@Inject(ClientRepository) private clientRepository: ClientRepository) {}

  execute(): Observable<ClientFormData | null> {
    const clientId = localStorage.getItem('loggedClient');
    const emailLogin = localStorage.getItem('emailLogin');

    if (clientId) {
      // Load logged client data
      return this.clientRepository.getById(clientId).pipe(
        map(client => {
          if (client) {
            return {
              name: client.name,
              email: client.email,
              phone: client.phone,
              address: client.address
            };
          }
          return null;
        })
      );
    } else if (emailLogin) {
      // Only prefill email if there's an email login
      return of({
        name: '',
        email: emailLogin,
        phone: '',
        address: ''
      });
    }

    return of(null);
  }
}
