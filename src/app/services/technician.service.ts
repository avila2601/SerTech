import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Technician, Tecnico } from '../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  private url = 'assets/data/tecnicos.json';

  constructor(private http: HttpClient) {}

  getTechnicians(): Observable<Technician[]> {
    return this.http.get<Tecnico[]>(this.url).pipe(
      map((tecnicos: Tecnico[]) =>
        tecnicos.map(tecnico => ({
          id: tecnico.id,
          name: tecnico.nombre,
          specialty: tecnico.especialidad,
          available: tecnico.disponible,
          rating: tecnico.calificacion,
          photo: tecnico.foto,
          password: tecnico.contraseña
        }) as Technician)
      )
    );
  }

  getTechnicianById(id: string): Observable<Technician | undefined> {
    return new Observable(observer => {
      this.getTechnicians().subscribe(technicians => {
        observer.next(technicians.find(technician => technician.id === id));
        observer.complete();
      });
    });
  }

  getAvailableTechnicians(): Observable<Technician[]> {
    return new Observable(observer => {
      this.getTechnicians().subscribe(technicians => {
        observer.next(technicians.filter((tech: Technician) => tech.available));
        observer.complete();
      });
    });
  }
}
