import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

export abstract class ClientRepository {
  abstract getAll(): Observable<Client[]>;
  abstract getById(id: string): Observable<Client | null>;
  abstract create(client: Omit<Client, 'id'>): Observable<Client>;
  abstract update(id: string, data: Partial<Client>): Observable<Client | null>;
  abstract delete(id: string): Observable<boolean>;
  abstract getByEmail(email: string): Observable<Client | null>;
}
