import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITechnicianRepository } from '../../../core/domain/repositories/technician.repository';
import { Technician } from '../../../core/domain/models/technician.model';

@Injectable({
  providedIn: 'root'
})
export class TechnicianJsonRepository extends ITechnicianRepository {
  private dataUrl = 'assets/data/technicians.json';

  constructor(private http: HttpClient) {
    super();
  }

  getAll(): Observable<Technician[]> {
    return this.http.get<Technician[]>(this.dataUrl);
  }

  getById(id: string): Observable<Technician | undefined> {
    return this.getAll().pipe(
      map(technicians => technicians.find(t => t.id === id))
    );
  }
}
