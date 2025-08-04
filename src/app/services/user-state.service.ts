import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserType } from '../models';

export interface UserState {
  isLoggedIn: boolean;
  userType: UserType | null;
  userId: string | null;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private userStateSubject = new BehaviorSubject<UserState>({
    isLoggedIn: false,
    userType: null,
    userId: null
  });

  public userState$ = this.userStateSubject.asObservable();

  constructor() {
    this.initializeUserState();
    this.listenToStorageChanges();
  }

  private initializeUserState(): void {
    const loggedTechnician = localStorage.getItem('loggedTechnician');
    const loggedClient = localStorage.getItem('loggedClient');
    const emailLogin = localStorage.getItem('emailLogin');

    if (loggedTechnician) {
      this.userStateSubject.next({
        isLoggedIn: true,
        userType: UserType.TECHNICIAN,
        userId: loggedTechnician
      });
    } else if (loggedClient || emailLogin) {
      this.userStateSubject.next({
        isLoggedIn: true,
        userType: UserType.CLIENT,
        userId: loggedClient || emailLogin || '',
        email: emailLogin || undefined
      });
    }
  }

  private listenToStorageChanges(): void {
    window.addEventListener('storage', (event) => {
      if (event.key?.includes('Logueado') || event.key?.includes('logged') || event.key === 'emailLogin') {
        this.initializeUserState();
      }
    });
  }

  getCurrentUserState(): UserState {
    return this.userStateSubject.value;
  }

  loginTechnician(technicianId: string): void {
    localStorage.setItem('loggedTechnician', technicianId);
    this.userStateSubject.next({
      isLoggedIn: true,
      userType: UserType.TECHNICIAN,
      userId: technicianId
    });
  }

  loginClient(clientId: string, email?: string): void {
    localStorage.setItem('loggedClient', clientId);
    if (email) {
      localStorage.setItem('emailLogin', email);
    }
    this.userStateSubject.next({
      isLoggedIn: true,
      userType: UserType.CLIENT,
      userId: clientId,
      email
    });
  }

  logout(): void {
    // Clear all auth-related localStorage items
    localStorage.removeItem('loggedTechnician');
    localStorage.removeItem('loggedClient');
    localStorage.removeItem('emailLogin');

    this.userStateSubject.next({
      isLoggedIn: false,
      userType: null,
      userId: null
    });
  }

  isLoggedIn(): boolean {
    return this.userStateSubject.value.isLoggedIn;
  }

  isTechnician(): boolean {
    return this.userStateSubject.value.userType === UserType.TECHNICIAN;
  }

  isClient(): boolean {
    return this.userStateSubject.value.userType === UserType.CLIENT;
  }

  getUserId(): string | null {
    return this.userStateSubject.value.userId;
  }

  // Spanish compatibility methods (deprecated)
  loginTecnico = this.loginTechnician;
  loginCliente = this.loginClient;
  esTecnico = this.isTechnician;
  esCliente = this.isClient;
}
