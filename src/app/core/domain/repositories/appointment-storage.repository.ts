import { Observable } from 'rxjs';
import { CitaData } from '../../../models/data-types';
import { AppointmentStatus } from '../../../models';

/**
 * Repository interface for appointment storage operations
 * Defines the contract for appointment data persistence
 */
export abstract class AppointmentStorageRepository {
  /**
   * Get all appointments from storage
   */
  abstract getAll(): Observable<CitaData[]>;

  /**
   * Get appointments by client ID
   */
  abstract getByClient(clientId: string): Observable<CitaData[]>;

  /**
   * Get appointment by ID
   */
  abstract getById(id: string): Observable<CitaData | undefined>;

  /**
   * Create a new appointment
   */
  abstract create(appointment: Omit<CitaData, 'id' | 'estado'>): Observable<CitaData>;

  /**
   * Update an existing appointment
   */
  abstract update(id: string, data: Partial<CitaData>): Observable<CitaData | null>;

  /**
   * Cancel an appointment
   */
  abstract cancel(id: string): Observable<void>;

  /**
   * Update appointment status
   */
  abstract updateStatus(id: string, status: AppointmentStatus): Observable<CitaData | null>;
}
