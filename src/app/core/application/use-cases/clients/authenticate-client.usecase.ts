import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ClientRepository } from '../../../domain/repositories/client.repository';
import { UserStateService } from '../../services/user-state.service';

export interface AuthenticationData {
  email: string;
}

export interface AuthenticationResult {
  success: boolean;
  clientFound: boolean;
  clientId?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticateClientUseCase {
  constructor(
    @Inject(ClientRepository) private clientRepository: ClientRepository,
    private userStateService: UserStateService
  ) {}

  execute(data: AuthenticationData): Observable<AuthenticationResult> {
    // First validate email format
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      return of({
        success: false,
        clientFound: false,
        message: emailValidation.message
      });
    }

    // Search for client by email
    return this.clientRepository.getByEmail(data.email).pipe(
      switchMap(client => {
        if (client) {
          // Client exists - log them in with their ID
          this.userStateService.loginClient(client.id, client.email);

          // Clear any previous email-only login
          localStorage.removeItem('emailLogin');

          return of({
            success: true,
            clientFound: true,
            clientId: client.id,
            message: 'Cliente autenticado exitosamente'
          });
        } else {
          // Client doesn't exist - save email for future registration
          localStorage.setItem('emailLogin', data.email);
          localStorage.removeItem('loggedClient');

          return of({
            success: true,
            clientFound: false,
            message: 'Email guardado para registro posterior'
          });
        }
      })
    );
  }

  private validateEmail(email: string): { isValid: boolean; message: string } {
    if (!email) {
      return {
        isValid: false,
        message: 'Por favor, ingresa tu e-mail.'
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        message: 'Por favor, ingresa un e-mail válido.'
      };
    }

    return {
      isValid: true,
      message: 'Email válido'
    };
  }
}
