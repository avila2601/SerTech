import { Injectable } from '@angular/core';
import { UserType } from '../../../models';

export interface StoredUserData {
  userId: string;
  userType: UserType;
  email?: string;
}

/**
 * Repository for user authentication storage operations
 * Handles browser storage persistence for user state
 */
@Injectable({
  providedIn: 'root'
})
export class UserStorageRepository {

  /**
   * Get stored user data from localStorage
   */
  getStoredUser(): StoredUserData | null {
    const loggedTechnician = localStorage.getItem('loggedTechnician');
    const loggedClient = localStorage.getItem('loggedClient');
    const emailLogin = localStorage.getItem('emailLogin');

    if (loggedTechnician) {
      return {
        userId: loggedTechnician,
        userType: UserType.TECHNICIAN
      };
    }

    if (loggedClient || emailLogin) {
      return {
        userId: loggedClient || emailLogin || '',
        userType: UserType.CLIENT,
        email: emailLogin || undefined
      };
    }

    return null;
  }

  /**
   * Store technician login data
   */
  storeTechnicianLogin(technicianId: string): void {
    localStorage.setItem('loggedTechnician', technicianId);
  }

  /**
   * Store client login data
   */
  storeClientLogin(clientId: string, email?: string): void {
    localStorage.setItem('loggedClient', clientId);
    if (email) {
      localStorage.setItem('emailLogin', email);
    }
  }

  /**
   * Clear all stored user data
   */
  clearStoredUser(): void {
    localStorage.clear();
  }

  /**
   * Listen to storage changes across browser tabs
   */
  onStorageChange(callback: () => void): void {
    window.addEventListener('storage', (event) => {
      if (event.key?.includes('Logueado') ||
          event.key?.includes('logged') ||
          event.key === 'emailLogin') {
        callback();
      }
    });
  }
}
