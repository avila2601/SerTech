import { UserType } from '../../../models';

/**
 * User storage repository interface
 * Defines the contract for user data persistence operations
 */
export interface StoredUser {
  userType: UserType;
  userId: string;
  email?: string;
}

export abstract class UserStorageRepository {
  /**
   * Get stored user data
   */
  abstract getStoredUser(): StoredUser | null;

  /**
   * Store technician login data
   */
  abstract storeTechnicianLogin(technicianId: string): void;

  /**
   * Store client login data
   */
  abstract storeClientLogin(clientId: string, email?: string): void;

  /**
   * Clear stored user data
   */
  abstract clearStoredUser(): void;

  /**
   * Listen to storage changes
   */
  abstract onStorageChange(callback: () => void): void;
}
