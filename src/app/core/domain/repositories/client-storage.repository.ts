import { Observable } from 'rxjs';
import { ClienteData } from '../../../models/data-types';

/**
 * Repository interface for client storage operations
 * Defines the contract for client data persistence
 */
export abstract class ClientStorageRepository {
  /**
   * Get all clients from storage
   */
  abstract getAll(): Observable<ClienteData[]>;

  /**
   * Get a client by ID
   */
  abstract getById(id: string): Observable<ClienteData | undefined>;

  /**
   * Create a new client
   */
  abstract create(client: Omit<ClienteData, 'id'>): Observable<ClienteData>;

  /**
   * Update an existing client
   */
  abstract update(id: string, data: Partial<ClienteData>): Observable<ClienteData | null>;

  /**
   * Delete a client by ID
   */
  abstract delete(id: string): Observable<boolean>;
}
