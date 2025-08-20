import { Observable } from 'rxjs';
import { Service } from '../models/service.model';
import { ServiceCategory } from '../../../models';

export abstract class ServiceRepository {
  abstract getAll(): Observable<Service[]>;
  abstract getById(id: string): Observable<Service | null>;
  abstract getByCategory(category: ServiceCategory): Observable<Service[]>;
  abstract create(service: Omit<Service, 'id'>): Observable<Service>;
  abstract update(id: string, data: Partial<Service>): Observable<Service | null>;
  abstract delete(id: string): Observable<boolean>;
}
