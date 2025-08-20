import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserType } from '../../../models';
import { UserStorageRepository } from '../../../infrastructure/driven-adapters/storage/user-storage.repository';

export interface UserState {
  isLoggedIn: boolean;
  userType: UserType | null;
  userId: string | null;
  email?: string;
}

/**
 * User state management service
 * Handles user authentication state using Clean Architecture principles
 * - State management: BehaviorSubject for reactive state
 * - Persistence: Delegates to UserStorageRepository (Infrastructure layer)
 */
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

  constructor(private userStorageRepository: UserStorageRepository) {
    this.initializeUserState();
    this.listenToStorageChanges();
  }

  private initializeUserState(): void {
    const storedUser = this.userStorageRepository.getStoredUser();

    if (storedUser) {
      this.userStateSubject.next({
        isLoggedIn: true,
        userType: storedUser.userType,
        userId: storedUser.userId,
        email: storedUser.email
      });
    }
  }

  private listenToStorageChanges(): void {
    this.userStorageRepository.onStorageChange(() => {
      this.initializeUserState();
    });
  }

  getCurrentUserState(): UserState {
    return this.userStateSubject.value;
  }

  loginTechnician(technicianId: string): void {
    this.userStorageRepository.storeTechnicianLogin(technicianId);
    this.userStateSubject.next({
      isLoggedIn: true,
      userType: UserType.TECHNICIAN,
      userId: technicianId
    });
  }

  loginClient(clientId: string, email?: string): void {
    this.userStorageRepository.storeClientLogin(clientId, email);
    this.userStateSubject.next({
      isLoggedIn: true,
      userType: UserType.CLIENT,
      userId: clientId,
      email
    });
  }

  logout(): void {
    this.userStorageRepository.clearStoredUser();
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
}
