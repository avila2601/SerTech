import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

export interface LoginSuccessParams {
  clientFound: boolean;
  clientId?: string;
  redirectToHome?: boolean;
}

export interface LoginSuccessResult {
  success: boolean;
  navigationPerformed: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class HandleLoginSuccessUseCase {
  constructor(private router: Router) {}

  execute(params: LoginSuccessParams): Observable<LoginSuccessResult> {
    try {
      // Trigger storage events to update UI components
      this.triggerStorageEvents(params);

      // Handle navigation
      if (params.redirectToHome !== false) {
        this.router.navigate(['/']);
      }

      const message = params.clientFound
        ? 'Sesión iniciada exitosamente'
        : 'Email registrado, puedes continuar con el proceso';

      return of({
        success: true,
        navigationPerformed: params.redirectToHome !== false,
        message
      });

    } catch (error) {
      console.error('Error handling login success:', error);
      return of({
        success: false,
        navigationPerformed: false,
        message: 'Error procesando el login exitoso'
      });
    }
  }

  private triggerStorageEvents(params: LoginSuccessParams): void {
    // Trigger storage events to update navbar and other components
    if (params.clientFound && params.clientId) {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'loggedClient',
        newValue: params.clientId
      }));
    } else {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'emailLogin',
        newValue: localStorage.getItem('emailLogin')
      }));
    }
  }
}
