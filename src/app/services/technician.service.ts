import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Technician } from '../models';

// Temporary interface for reading Spanish data files
interface TecnicoData {
  id: string;
  nombre: string;
  especialidad: string;
  calificacion: number;
  disponible: boolean;
  foto?: string;
  contraseña: string;
}

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  private url = 'assets/data/technicians.json';

  constructor(private http: HttpClient) {}

  // Primary English interface methods
  getTechnicians(): Observable<Technician[]> {
    return this.http.get<TecnicoData[]>(this.url).pipe(
      map((tecnicos: TecnicoData[]) =>
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

  // Backward compatibility Spanish interface methods (deprecated)
  getTecnicos(): Observable<TecnicoData[]> {
    return this.http.get<TecnicoData[]>(this.url);
  }

  getTecnicoById(id: string): Observable<TecnicoData | undefined> {
    return new Observable(observer => {
      this.getTecnicos().subscribe(tecnicos => {
        observer.next(tecnicos.find(tecnico => tecnico.id === id));
        observer.complete();
      });
    });
  }

  getTecnicosDisponibles(): Observable<TecnicoData[]> {
    return new Observable(observer => {
      this.getTecnicos().subscribe(tecnicos => {
        observer.next(tecnicos.filter((t: TecnicoData) => t.disponible));
        observer.complete();
      });
    });
  }
}
