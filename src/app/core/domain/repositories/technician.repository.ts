import { Observable } from 'rxjs';
import { Technician } from '../models/technician.model';

export abstract class ITechnicianRepository {
  abstract getAll(): Observable<Technician[]>;
  abstract getById(id: string): Observable<Technician | undefined>;
}
