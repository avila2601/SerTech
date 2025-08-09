import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITechnicianRepository } from '../../../core/domain/repositories/technician.repository';
import { Technician } from '../../../core/domain/models/technician.model';
import { TecnicoData } from '../../../models/data-types'; // The old Spanish data type

@Injectable({
  providedIn: 'root'
})
export class TechnicianJsonRepository extends ITechnicianRepository {
  private dataUrl = 'assets/data/technicians.json';

  constructor(private http: HttpClient) {
    super();
  }

  getAll(): Observable<Technician[]> {
    return this.http.get<TecnicoData[]>(this.dataUrl).pipe(
      map(tecnicosData => tecnicosData.map(this.mapToTechnician))
    );
  }

  getById(id: string): Observable<Technician | undefined> {
    return this.getAll().pipe(
      map(technicians => technicians.find(t => t.id === id))
    );
  }

  private mapToTechnician(data: TecnicoData): Technician {
    return {
      id: data.id,
      name: data.nombre,
      specialty: data.especialidad,
      rating: data.calificacion,
      available: data.disponible,
      photo: data.foto
    };
  }
}
